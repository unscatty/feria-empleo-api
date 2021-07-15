import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('contact_detail')
export class ContactDetail extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar', nullable: false, length: 15 })
  phone: string;

  @Column({ name: 'web_site', type: 'varchar', nullable: true })
  webSite: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ name: 'linkedin_url', type: 'varchar', nullable: true })
  linkedinUrl: string;

  @Column({ name: 'facebook_url', type: 'varchar', nullable: true })
  facebookUrl: string;

  @Column({ name: 'github_url', type: 'varchar', nullable: true })
  githubUrl: string;

  @OneToOne((type) => User, (user) => user.contactDetail, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
