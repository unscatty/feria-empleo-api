import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UploadedImage extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: '500', nullable: false })
  imageURL: string;

  // Timestamps

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
