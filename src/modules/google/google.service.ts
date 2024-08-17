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

  public isGoogleSheet(url: string): boolean {
    return url.includes('docs.google.com/spreadsheets');
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

  public async downloadAsDocx(url: string): Promise<Buffer | null> {
    const fileId = this.extractFileId(url);
    if (
      this.isGoogleDocs(url) ||
      (this.isGoogleDriveFile(url) && this.isDocFile(url))
    ) {
      const exportUrl = `https://docs.google.com/feeds/download/documents/export/Export?id=${fileId}&exportFormat=docx`;
      return this.downloadFile(exportUrl);
    }
    return null;
  }

  public async downloadLink(url: string): Promise<void> {
    if (this.isGoogleLink(url)) {
      if (this.isGoogleDriveFile(url) || this.isDocFile(url)) {
        const fileBuffer = await this.download(url);
        if (fileBuffer) {
          const fileName = `${this.getId(url)}.docx`; // Assuming the file is a docx
          const filePath = path.join('downloads', fileName);
          fs.writeFileSync(filePath, fileBuffer);
          console.log(`Downloaded file to ${filePath}`);
        } else {
          console.error('Failed to download the file.');
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
        const fileName = path.basename(url);
        const filePath = path.join('downloads', fileName);
        fs.writeFileSync(filePath, response.data);
        console.log(`Downloaded file to ${filePath}`);
      } catch (error) {
        console.error('Failed to download the file:', error);
      }
    }
  }

  public async download(url: string): Promise<Buffer | null> {
    const fileId = this.extractFileId(url);
    if (
      this.isGoogleDocs(url) ||
      this.isGoogleSheet(url) ||
      this.isGoogleDriveFile(url)
    ) {
      const exportUrl = this.getExportUrl(url, fileId);
      return this.downloadFile(exportUrl);
    }
    return null;
  }

  public async downloadAsExcel(url: string): Promise<Buffer | null> {
    const fileId = this.extractFileId(url);
    if (
      this.isGoogleSheet(url) ||
      (this.isGoogleDriveFile(url) && this.isExcelFile(url))
    ) {
      const exportUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
      return this.downloadFile(exportUrl);
    }
    return null;
  }

  private async downloadFile(url: string): Promise<Buffer | null> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  private getExportUrl(url: string, fileId: string): string {
    if (this.isGoogleDocs(url)) {
      return `https://docs.google.com/document/d/${fileId}/export?format=docx`;
    } else if (this.isGoogleSheet(url)) {
      return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
    } else if (this.isGoogleDriveFile(url)) {
      return `https://drive.google.com/uc?id=${fileId}&export=download`;
    }
    return '';
  }

  private isDocFile(url: string): boolean {
    // This method would ideally check if the Google Drive file is a word processing document
    return url.endsWith('.docx') || url.endsWith('.odt');
  }

  private isExcelFile(url: string): boolean {
    // This method would ideally check if the Google Drive file is an Excel file
    return url.endsWith('.xlsx') || url.endsWith('.ods');
  }

  public isGoogleLink(url: string): boolean {
    return url.includes('google.com');
  }
}
