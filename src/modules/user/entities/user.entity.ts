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
import { Candidate } from 'src/modules/candidate/models/candidate.entity';
import { Company } from '../../company/entities/company.entity';
import { ContactDetail } from './contact-detail.entity';
import { Role } from './role.entity';
export { RoleType } from './role.entity';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships

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

  @OneToOne(() => Candidate, (candidate) => candidate.user, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  candidate?: Candidate;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;
}
