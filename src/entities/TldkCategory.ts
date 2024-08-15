import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TldkCategory', { schema: 'AllCrawler' })
export class TldkCategory {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  categoryLink?: string;

  @Column()
  numberOfPage?: number;
}
