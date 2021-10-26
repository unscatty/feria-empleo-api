import { Candidate } from 'src/modules/candidate/models/candidate.entity';
import { TransformToPlain } from 'src/shared/decorators/class-transform';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { ContactDetail } from './contact-detail.entity';
import { Role, RoleType } from './role.entity';
export { RoleType } from './role.entity';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  lastname: string;

  private is(role: RoleType) {
    return this.role.name === role;
  }

  isAdmin(): boolean {
    return this.is(RoleType.ADMIN);
  }

  isCompany(): boolean {
    return this.is(RoleType.COMPANY);
  }

  isCandidate(): boolean {
    return this.is(RoleType.CANDIDATE);
  }

  get roleGroup(): string {
    return this.role?.group;
  }

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships

  @OneToOne(() => Company, (company) => company.user, {
    eager: false,
    nullable: true,
    cascade: false,
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
    eager: false,
    nullable: true,
    cascade: false,
    onDelete: 'CASCADE',
  })
  candidate?: Candidate;

  @ManyToOne(() => Role, { eager: true, cascade: true })
  @TransformToPlain(({ value }) => value?.name)
  role: Role;
}
