import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TldkDocument } from './TldkDocument';

@Entity('TldkCategory', { schema: 'AllCrawler' })
export class TldkCategory {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('varchar', { name: 'slug', nullable: true, length: 255 })
  slug: string | null;

  @Column('varchar', { name: 'link', nullable: true, length: 255 })
  link: string | null;

  @Column('bigint', { name: 'page', nullable: true })
  page: number | null;

  @Column('timestamp', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp', {
    name: 'updatedAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @Column('timestamp', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => TldkDocument, (tldkDocument) => tldkDocument.category)
  tldkDocuments: TldkDocument[];
}
