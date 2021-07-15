import { MigrationInterface, QueryRunner } from 'typeorm';

export class createJobApply1626320947702 implements MigrationInterface {
  name = 'createJobApply1626320947702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `job_apply` (`candidate_id` int NOT NULL, `job_post_id` int NOT NULL, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`candidate_id`, `job_post_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `job_posts` DROP COLUMN `description`',
    );
    await queryRunner.query(
      'ALTER TABLE `job_posts` ADD `description` varchar(500) NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `job_posts` DROP COLUMN `created_at`');
    await queryRunner.query(
      'ALTER TABLE `job_posts` ADD `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query('ALTER TABLE `job_posts` DROP COLUMN `updated_at`');
    await queryRunner.query(
      'ALTER TABLE `job_posts` ADD `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `job_posts` DROP COLUMN `updated_at`');
    await queryRunner.query(
      'ALTER TABLE `job_posts` ADD `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query('ALTER TABLE `job_posts` DROP COLUMN `created_at`');
    await queryRunner.query(
      'ALTER TABLE `job_posts` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `job_posts` DROP COLUMN `description`',
    );
    await queryRunner.query(
      'ALTER TABLE `job_posts` ADD `description` varchar(255) NOT NULL',
    );
    await queryRunner.query('DROP TABLE `job_apply`');
  }
}
