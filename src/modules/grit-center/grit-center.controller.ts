import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import path from 'path';
import { GritCenterDocumentDto } from './dtos/grit-center.dto';
import { GritCenterService } from './grit-center.service';
import './json/document.json';

@ApiTags('GritCenter')
@Controller('/api/grit-center')
export class GritCenterController {
  constructor(private service: GritCenterService) {}

  // @Get('/documents')
  public async documents() {
    const jsonPath = path.resolve(__dirname, './json/document.json');

    const jsonString = readFileSync(jsonPath, 'utf8');
    const json: { lists: GritCenterDocumentDto[] } = JSON.parse(jsonString);

    this.service.syncJson(json.lists);

    return Promise.resolve(true);
  }

  @Get('/google-docs')
  public async googleDocs() {
    return await this.service.googleDocs();
  }

  @Get('google-docs-links')
  public async googleDocsLinks() {
    return await this.service.googleDocsLinks();
  }
}
