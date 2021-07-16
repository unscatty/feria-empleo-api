import { MigrationInterface, QueryRunner } from 'typeorm';

export class createJobPostSkillSet1626324787941 implements MigrationInterface {
  name = 'createJobPostSkillSet1626324787941';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `job_applications` (`candidate_id` int NOT NULL, `job_post_id` int NOT NULL, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`candidate_id`, `job_post_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `job_post_skill_sets` (`job_post_id` int NOT NULL, `skill_set_id` int NOT NULL, `level` int NOT NULL, `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`job_post_id`, `skill_set_id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `job_post_skill_sets`');
    await queryRunner.query('DROP TABLE `job_applications`');
  }
}
