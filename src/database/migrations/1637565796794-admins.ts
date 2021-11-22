import { MigrationInterface, QueryRunner } from 'typeorm';

export class admins1637565796794 implements MigrationInterface {
  name = 'admins1637565796794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO [user] (name, lastname, email, role_id) values ('Francisco', 'Serrano', 'eventos.escom@gmail.com', (SELECT id FROM role WHERE name = 'ADMIN'))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM [user] WHERE email = 'eventos.escom@gmail.com'`);
  }
}
