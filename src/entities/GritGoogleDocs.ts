import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('gritDocumentId', ['gritDocumentId'], { unique: true })
@Index('gritArticleId', ['gritArticleId'], { unique: true })
@Index('IDX_2394cbaf0e698600c7f31ce55a', ['gritDocumentId'], { unique: true })
@Index('IDX_c039f66934b6ffb581f4ed0000', ['gritArticleId'], { unique: true })
@Index('REL_2394cbaf0e698600c7f31ce55a', ['gritDocumentId'], { unique: true })
@Index('REL_c039f66934b6ffb581f4ed0000', ['gritArticleId'], { unique: true })
@Entity('GritGoogleDocs', { schema: 'AllCrawler' })
export class GritGoogleDocs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'googleDocsLink', length: 255 })
  googleDocsLink: string;

  @Column('int', { name: 'gritDocumentId', nullable: true, unique: true })
  gritDocumentId: number | null;

  @Column('int', { name: 'gritArticleId', nullable: true, unique: true })
  gritArticleId: number | null;

  @Column('varchar', { name: 'fileId', length: 255 })
  fileId: string;
}
