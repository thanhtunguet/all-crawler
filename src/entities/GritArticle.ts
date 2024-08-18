import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('GritArticle', { schema: 'AllCrawler' })
export class GritArticle {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @Column('varchar', { name: 'slug', nullable: true, length: 255 })
  slug: string | null;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('varchar', { name: 'image', nullable: true, length: 255 })
  image: string | null;

  @Column('tinyint', { name: 'type', nullable: true })
  type: number | null;

  @Column('varchar', { name: 'fileAudio', nullable: true, length: 255 })
  fileAudio: string | null;

  @Column('varchar', { name: 'filePdf', nullable: true, length: 255 })
  filePdf: string | null;

  @Column('varchar', { name: 'link', nullable: true, length: 255 })
  link: string | null;

  @Column('varchar', { name: 'typeName', nullable: true, length: 255 })
  typeName: string | null;

  @Column('tinyint', { name: 'isBookmark', nullable: true, width: 1 })
  isBookmark: boolean | null;
}
