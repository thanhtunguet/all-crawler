import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LinkPage {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  categoryLink?: string;

  @Column()
  pageNumber?: number;

  @Column()
  documentLink?: string;

  @Column({ nullable: true })
  localName?: string;

  @Column()
  googleDriveId?: string;

  @Column()
  isGoogleDocs?: boolean;

  @Column()
  isFolder?: boolean;
}
