import { Exclude, Expose } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RoleType {
  ADMIN = 'ADMIN',
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
}

@Entity()
export class Role extends BaseEntity {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Expose()
  @Column({
    type: 'simple-enum',
    enum: RoleType,
    default: RoleType.CANDIDATE,
  })
  name: RoleType;

  // Timestamps

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
