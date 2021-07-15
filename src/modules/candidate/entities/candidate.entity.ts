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
import { User } from '../../user/entities/user.entity';

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar', length: 25, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastname: string;

  @Column({ type: 'float', nullable: true })
  currentSalary: number;

  @JoinColumn({ name: 'user_id' })
  @OneToOne(() => User, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  user: User;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at' })
  updateAt: Date;
}
