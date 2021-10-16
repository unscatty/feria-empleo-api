import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ContactDetail extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 15 })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  webSite: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  linkedinUrl: string;

  @Column({ type: 'varchar', nullable: true })
  facebookUrl: string;

  @Column({ type: 'varchar', nullable: true })
  githubUrl: string;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships

  @OneToOne(() => User, (user) => user.contactDetail, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user: User | number;
}
