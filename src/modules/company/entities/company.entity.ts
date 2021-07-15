import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('company')
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ name: 'video_url', type: 'varchar', nullable: true })
  videoUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  staff?: string;

  @OneToOne(() => User, (user) => user.company, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
