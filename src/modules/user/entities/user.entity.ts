import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { ContactDetail } from './contact-detail.entity';

export enum RoleType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  EMPLOYER = 'EMPLOYER',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @OneToOne(() => Company, (company) => company.user, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  }) // use bi-directional with company
  company?: Company;

  @OneToOne(() => ContactDetail, (contact) => contact.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  contactDetail?: ContactDetail;

  // TODO join with role table
  @Column({ type: 'varchar', nullable: false, default: RoleType.STUDENT })
  role: RoleType;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at' })
  updateAt: Date;
}
