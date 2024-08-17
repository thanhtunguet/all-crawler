import { ApiProperty } from '@nestjs/swagger';
import { TldkJob } from './job.dto';

export class TldkDocumentJob extends TldkJob {
  public static DOCUMENT_JOB = 'document/topic';

  @ApiProperty({
    type: 'string',
  })
  public link: string;

  @ApiProperty({
    type: 'string',
  })
  public name: string;
}
