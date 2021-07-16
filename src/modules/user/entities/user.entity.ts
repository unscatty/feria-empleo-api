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
import { Company } from '../../company/entities/company.entity';
import { ContactDetail } from './contact-detail.entity';
import { Role } from './role.entity';
export { RoleType } from './role.entity';
@Entity('users')
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

  @OneToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at' })
  updateAt: Date;
}
