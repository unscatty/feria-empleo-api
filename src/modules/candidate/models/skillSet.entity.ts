import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SkillSet extends BaseEntity {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'update_at' })
  updateAt: Date;
}
