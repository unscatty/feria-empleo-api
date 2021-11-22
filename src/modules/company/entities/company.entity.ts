import { StateStore } from '@depthlabs/nestjs-state-machine';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UploadedImage } from '../../../core/entities/uploaded-image.entity';
import { COMPANY_GRAPH_NAME, COMPANY_STATES } from '../../../core/state-machines/company.graph';
import { ExposeToPlain, TransformToPlain } from '../../../shared/decorators/class-transform';
import { ExposeAdminDefault } from '../../../shared/decorators/expose-role-groups';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { RoleGroup } from '../../user/entities/role.entity';
import { User } from '../../user/entities/user.entity';

export enum CompanyUseEmailOptions {
  INVITATION = 'INVITATION',
  USER = 'USER',
}

@ExposeAdminDefault
@Entity()
export class Company extends BaseEntity {
  static EmailOptions = CompanyUseEmailOptions;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ExposeToPlain({ groups: [RoleGroup.CURRENT_USER] })
  @Column({ type: 'varchar' })
  invitationEmail: string;

  @Column({ type: 'varchar', nullable: false })
  activeEmail!: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  videoUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  staff?: string;

  @Column({ nullable: false, default: true })
  isActive!: boolean;

  // State (StateMachine)
  // Default state is 'INVITED'
  @StateStore(COMPANY_GRAPH_NAME)
  @Column({ nullable: false, default: COMPANY_STATES.INVITED })
  state: string;

  // Methods

  getAvailableEmail(emailOption: CompanyUseEmailOptions): string {
    switch (emailOption) {
      case CompanyUseEmailOptions.INVITATION:
        return this.invitationEmail;

      case CompanyUseEmailOptions.USER:
        return this.user.email;
    }
  }

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // Relationships
  @ExposeToPlain({ name: 'imageURL' })
  @TransformToPlain(({ value }) => value?.imageURL)
  // Uploaded image
  @OneToOne(() => UploadedImage, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  image?: UploadedImage;

  @ExposeToPlain({ groups: [RoleGroup.CURRENT_USER] })
  @OneToOne(() => User, (user) => user.company, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => JobPost, (jobPost) => jobPost.company)
  jobPosts: JobPost[];
}
