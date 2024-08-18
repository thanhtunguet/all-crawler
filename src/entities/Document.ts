import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category';
import { FileType } from './FileType';

@Index('fileTypeId', ['fileTypeId'], {})
@Index('categoryId', ['categoryId'], {})
@Entity('Document', { schema: 'AllCrawler' })
export class Document {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'categoryId' })
  categoryId: number;

  @Column('varchar', { name: 'link', nullable: true, length: 255 })
  link: string | null;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('varchar', { name: 'originalId', nullable: true, length: 255 })
  originalId: string | null;

  @Column('int', { name: 'fileTypeId' })
  fileTypeId: number;

  @ManyToOne(() => FileType, (fileType) => fileType.documents, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'fileTypeId', referencedColumnName: 'id' }])
  fileType: FileType;

  @ManyToOne(() => Category, (category) => category.documents, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  category: Category;
}
