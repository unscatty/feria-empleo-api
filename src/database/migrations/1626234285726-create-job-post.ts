import { MigrationInterface, QueryRunner } from 'typeorm';

export class createJobPost1626234285726 implements MigrationInterface {
  name = 'createJobPost1626234285726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `job_posts` (`id` int NOT NULL AUTO_INCREMENT, `is_active` tinyint NOT NULL DEFAULT 1, `job_title` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `requirements` varchar(255) NOT NULL, `salary_min` int NOT NULL, `salary_max` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `job_posts`');
  }
}
