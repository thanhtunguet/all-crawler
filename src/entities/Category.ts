import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './Document';
import { Website } from './Website';

@Index('websiteId', ['websiteId'], {})
@Entity('Category', { schema: 'AllCrawler' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'websiteId' })
  websiteId: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'link', nullable: true, length: 255 })
  link: string | null;

  @Column('int', { name: 'numberOfPages', nullable: true })
  numberOfPages: number | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @ManyToOne(() => Website, (website) => website.categories, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'websiteId', referencedColumnName: 'id' }])
  website: Website;

  @OneToMany(() => Document, (document) => document.category)
  documents: Document[];
}
