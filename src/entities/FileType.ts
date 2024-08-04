import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './Document';

@Entity('FileType', { schema: 'AllCrawler' })
export class FileType {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'name',
    enum: ['Link', 'GoogleDocs', 'GoogleDrive', 'File', 'Image'],
  })
  name: 'Link' | 'GoogleDocs' | 'GoogleDrive' | 'File' | 'Image';

  @OneToMany(() => Document, (document) => document.fileType)
  documents: Document[];
}
