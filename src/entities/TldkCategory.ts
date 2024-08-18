import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TldkCategory', { schema: 'AllCrawler' })
export class TldkCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text', { nullable: true })
  name?: string;

  @Column('text', { nullable: true })
  slug?: string;

  @Column('text', { nullable: true })
  categoryLink?: string;

  @Column('int', { nullable: true })
  numberOfPage?: number;
}
