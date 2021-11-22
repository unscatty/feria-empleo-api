import { MigrationInterface, QueryRunner } from 'typeorm';

export class roles1637565184909 implements MigrationInterface {
  name = 'roles1637565184909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO role (name) values ('ADMIN')`);
    await queryRunner.query(`INSERT INTO role (name) values ('COMPANY')`);
    await queryRunner.query(`INSERT INTO role (name) values ('CANDIDATE')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role WHERE name = 'ADMIN'`);
    await queryRunner.query(`DELETE FROM role WHERE name = 'COMPANY'`);
    await queryRunner.query(`DELETE FROM role WHERE name = 'CANDIDATE'`);
  }
}
