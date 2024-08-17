import { ApiProperty } from '@nestjs/swagger';
import { TldkJob } from './job.dto';

export class TldkCategoryJob extends TldkJob {
  public static CATEGORY_JOB = 'category/topic';

  @ApiProperty({
    type: 'string',
  })
  public link: string;

  @ApiProperty({
    type: 'number',
  })
  public page: number;
}
