import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GritArticle } from './GritArticle';
import { GritGoogleDocs } from './GritGoogleDocs';

@Entity('GritDocument', { schema: 'AllCrawler' })
export class GritDocument {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'categoryId', nullable: true })
  categoryId: number | null;

  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @Column('varchar', { name: 'link', nullable: true, length: 255 })
  link: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('varchar', { name: 'image', nullable: true, length: 255 })
  image: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('datetime', { name: 'createdAt', nullable: true })
  createdAt: Date | null;

  @Column('datetime', { name: 'updatedAt', nullable: true })
  updatedAt: Date | null;

  @Column('tinyint', { name: 'type', nullable: true })
  type: number | null;

  @Column('tinyint', { name: 'status', nullable: true })
  status: number | null;

  @Column('varchar', { name: 'keyWords', nullable: true, length: 255 })
  keyWords: string | null;

  @Column('varchar', { name: 'fileAudio', nullable: true, length: 255 })
  fileAudio: string | null;

  @Column('varchar', { name: 'filePdf', nullable: true, length: 255 })
  filePdf: string | null;

  @Column('varchar', { name: 'slug', nullable: true, length: 255 })
  slug: string | null;

  @Column('tinyint', { name: 'feeType', nullable: true })
  feeType: number | null;

  @OneToOne(
    () => GritGoogleDocs,
    (gritGoogleDocs) => gritGoogleDocs.gritDocument,
  )
  gritGoogleDocs: GritGoogleDocs;

  @ManyToOne(() => GritArticle, (gritArticle) => gritArticle.gritDocuments, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'gritArticleId', referencedColumnName: 'id' }])
  gritArticle: GritArticle;
}
