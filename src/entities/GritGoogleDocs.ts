import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GritArticle } from './GritArticle';
import { GritDocument } from './GritDocument';

@Index('gritDocumentId', ['gritDocumentId'], { unique: true })
@Index('gritArticleId', ['gritArticleId'], { unique: true })
@Entity('GritGoogleDocs', { schema: 'AllCrawler' })
export class GritGoogleDocs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'fileId', length: 255 })
  fileId: string;

  @Column('varchar', { name: 'googleDocsLink', length: 255 })
  googleDocsLink: string;

  @Column('int', { name: 'gritDocumentId', nullable: true, unique: true })
  gritDocumentId: number | null;

  @Column('int', { name: 'gritArticleId', nullable: true, unique: true })
  gritArticleId: number | null;

  @OneToOne(() => GritDocument, (gritDocument) => gritDocument.gritGoogleDocs, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'gritDocumentId', referencedColumnName: 'id' }])
  gritDocument: GritDocument;

  @OneToOne(() => GritArticle, (gritArticle) => gritArticle.gritGoogleDocs, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'gritArticleId', referencedColumnName: 'id' }])
  gritArticle: GritArticle;
}
