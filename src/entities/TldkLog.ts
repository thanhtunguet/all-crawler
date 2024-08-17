import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('TldkLog', { schema: 'AllCrawler' })
export class TldkLog {
  @PrimaryColumn()
  id?: number;

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  page?: number;

  @Column({ nullable: true })
  document?: string;

  @Column({ nullable: true })
  success?: boolean;
}
