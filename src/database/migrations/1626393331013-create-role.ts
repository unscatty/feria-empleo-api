import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRole1626393331013 implements MigrationInterface {
  name = 'createRole1626393331013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `roles` (`id` int NOT NULL AUTO_INCREMENT, `name` enum ('ADMIN', 'STUDENT', 'EMPLOYER') NOT NULL, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `role`');
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `update_at`');
    await queryRunner.query(
      'ALTER TABLE `users` ADD `update_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `update_at`');
    await queryRunner.query(
      'ALTER TABLE `users` ADD `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      "ALTER TABLE `users` ADD `role` varchar(255) NOT NULL DEFAULT 'STUDENT'",
    );
    await queryRunner.query('DROP TABLE `roles`');
  }
}
