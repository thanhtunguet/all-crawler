import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category';

@Entity('Website', { schema: 'AllCrawler' })
export class Website {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'url', length: 255 })
  url: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @OneToMany(() => Category, (category) => category.website)
  categories: Category[];
}
