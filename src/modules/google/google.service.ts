import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GoogleService {
  private extractFileId(url: string): string {
    const fileIdRegex = /[-\w]{25,}/;
    const match = url.match(fileIdRegex);
    return match ? match[0] : '';
  }

  public isGoogleDocs(url: string): boolean {
    return url.includes('docs.google.com/document');
  }

  public isGoogleDriveFile(url: string): boolean {
    return url.includes('drive.google.com/file');
  }

  public isGoogleDriveFolder(url: string): boolean {
    return url.includes('drive.google.com/drive/folders');
  }

  public getId(url: string): string {
    return this.extractFileId(url);
  }

  public async isAvailable(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  public async downloadAsDocx(
    url: string,
    name: string,
  ): Promise<{
    content: Buffer;
    name: string | null;
  }> {
    const fileId = this.extractFileId(url);
    if (
      this.isGoogleDocs(url) ||
      (this.isGoogleDriveFile(url) && this.isDocFile(url))
    ) {
      const exportUrl = `https://docs.google.com/feeds/download/documents/export/Export?id=${fileId}&exportFormat=docx`;
      return this.downloadFile(exportUrl, `${name}.docx`);
    }
    return null;
  }

  public async downloadLink(url: string, name: string): Promise<void> {
    if (this.isGoogleLink(url)) {
      if (this.isGoogleDriveFile(url) || this.isDocFile(url)) {
        const res = await this.download(url, name);
        if (res != null) {
          const { content: fileBuffer, name: filename } = res;
          if (fileBuffer) {
            const filePath = path.join('downloads', filename);
            fs.writeFileSync(filePath, fileBuffer);
            console.log(`Downloaded file to ${filePath}`);
          } else {
            console.error('Failed to download the file.');
          }
        }
      } else if (this.isGoogleDriveFolder(url)) {
        console.log('The link is a Google Drive folder.');
        const foldersFilePath = path.join('downloads', 'folders.txt');
        fs.appendFileSync(foldersFilePath, `${url}\n`);
        console.log(`Folder link appended to ${foldersFilePath}`);
      }
    } else {
      // Handle non-Google links
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Attempt to extract filename from Content-Disposition header
        const contentDisposition = response.headers['content-disposition'];
        let fileName: string;

        if (contentDisposition && contentDisposition.includes('filename=')) {
          fileName = contentDisposition
            .split('filename=')[1]
            .split(';')[0]
            .replace(/['"]/g, '');
        } else {
          // Fallback to the provided name argument
          fileName = name;
        }

        const filePath = path.join('downloads', fileName);
        fs.writeFileSync(filePath, response.data);
        console.log(`Downloaded file to ${filePath}`);
      } catch (error) {
        console.error('Failed to download the file:', error);
      }
    }
  }

  public async download(
    url: string,
    name: string,
  ): Promise<{
    content: Buffer;
    name: string | null;
  } | null> {
    const fileId = this.extractFileId(url);
    if (this.isGoogleDocs(url) || this.isGoogleDriveFile(url)) {
      const exportUrl = this.getExportUrl(url, fileId);
      return this.downloadFile(exportUrl, name);
    }
    return null;
  }

  private async downloadFile(
    url: string,
    name: string,
  ): Promise<{
    content: Buffer;
    name: string | null;
  }> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const contentDisposition = response.headers['content-disposition'];
      let filename: string;

      if (contentDisposition && name) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        const originalName = match ? match[1] : '';
        const extension = originalName.split('.').pop();
        filename = `${name.trim()}.${extension}`;
      } else {
        const match = contentDisposition.match(/filename="(.+)"/);
        filename = match ? match[1] : '';
      }

      return {
        content: response.data,
        name: filename,
      };
    } catch (error) {
      return null;
    }
  }

  private getExportUrl(url: string, fileId: string): string {
    if (this.isGoogleDocs(url)) {
      return `https://docs.google.com/document/d/${fileId}/export?format=docx`;
    } else if (this.isGoogleDriveFile(url)) {
      return `https://drive.google.com/uc?id=${fileId}&export=download`;
    }
    return '';
  }

  private isDocFile(url: string): boolean {
    // This method would ideally check if the Google Drive file is a word processing document
    return url.endsWith('.docx') || url.endsWith('.odt');
  }

  public isGoogleLink(url: string): boolean {
    return url.includes('google.com');
  }
}
