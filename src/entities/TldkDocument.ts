import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TldkCategory } from './TldkCategory';

@Index('TldkLink_TldkCategory_id_fk', ['categoryId'], {})
@Entity('TldkDocument', { schema: 'AllCrawler' })
export class TldkDocument {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'link', length: 255 })
  link: string;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('bigint', { name: 'categoryId', nullable: true })
  categoryId: string | null;

  @Column('varchar', { name: 'categoryName', nullable: true, length: 255 })
  categoryName: string | null;

  @Column('bigint', { name: 'categoryPage', nullable: true })
  categoryPage: number | null;

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

  @ManyToOne(() => TldkCategory, (tldkCategory) => tldkCategory.tldkDocuments, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category: TldkCategory;
}
