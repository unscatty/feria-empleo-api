import {MigrationInterface, QueryRunner} from "typeorm";

export class candidateMigration1626313374684 implements MigrationInterface {
    name = 'candidateMigration1626313374684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" int NOT NULL IDENTITY(1,1), "username" varchar(25) NOT NULL, "email" varchar(255) NOT NULL, "password" varchar(255) NOT NULL, "role" varchar(255) NOT NULL CONSTRAINT "DF_ace513fa30d485cfd25c11a9e4a" DEFAULT 'STUDENT', "school" varchar(255), "boleta" varchar(255), "created_at" datetime NOT NULL CONSTRAINT "DF_c9b5b525a96ddc2c5647d7f7fa5" DEFAULT getdate(), "update_at" datetime NOT NULL CONSTRAINT "DF_a642e3c62b8086f425cdcb0e9a2" DEFAULT getdate(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(25) NOT NULL, "lastname" varchar(50) NOT NULL, "currentSalary" float, "created_at" datetime NOT NULL CONSTRAINT "DF_3450070c4ea9d3816a7d5cdc3f6" DEFAULT getdate(), "update_at" datetime NOT NULL CONSTRAINT "DF_a7722cd46ac17bedd56001fad19" DEFAULT getdate(), "user_id" int NOT NULL, CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_77af458165fe750934e8425031" ON "candidate" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "skill_set" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(50) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_52375ae40c25b9a189697f5c571" DEFAULT getdate(), "update_at" datetime NOT NULL CONSTRAINT "DF_9d60c88c9fe6e2dd73d735a607a" DEFAULT getdate(), CONSTRAINT "PK_d94825f899a97846bca90d9952e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate_skill_set" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime NOT NULL CONSTRAINT "DF_66bf39a081a7d75bb39220f69c5" DEFAULT getdate(), "update_at" datetime NOT NULL CONSTRAINT "DF_77b84f1cb12c07acfb9a5a39712" DEFAULT getdate(), CONSTRAINT "PK_dec41bcc124e9ca79c485164476" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "education_detail" ("id" int NOT NULL IDENTITY(1,1), "institutionName" varchar(50) NOT NULL, "city" varchar(50) NOT NULL, "degree" varchar(50) NOT NULL, "startDate" date NOT NULL, "endDate" date, "description" varchar(250), "created_at" datetime NOT NULL CONSTRAINT "DF_59fb929ed450e9e168bc8db4436" DEFAULT getdate(), "update_at" datetime NOT NULL CONSTRAINT "DF_9b7d6dc91c36de2354e539d1c8a" DEFAULT getdate(), "candidate_id" int NOT NULL, CONSTRAINT "PK_8195337eac4ff2bc6defc59c818" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_0858e6c25a9a8eea4d94e55aa5" ON "education_detail" ("candidate_id") WHERE "candidate_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "experience_detail" ("id" int NOT NULL IDENTITY(1,1), "isCurrentjob" bit NOT NULL, "startDate" date NOT NULL, "endDate" date, "jobTitle" varchar(50) NOT NULL, "jobDescription" varchar(250) NOT NULL, "companyName" varchar(50) NOT NULL, "jobAdress" varchar(250) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_9399b4fb43c48cd9f65317618e9" DEFAULT getdate(), "update_at" datetime NOT NULL CONSTRAINT "DF_495ca0869688399c1b659d5be7f" DEFAULT getdate(), "candidate_id" int NOT NULL, CONSTRAINT "PK_3b2e0758ad577cdee403e132e86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_77af458165fe750934e8425031b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education_detail" ADD CONSTRAINT "FK_0858e6c25a9a8eea4d94e55aa5a" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_detail" ADD CONSTRAINT "FK_b8cf3c2b284c2060c3bc5defd45" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_detail" DROP CONSTRAINT "FK_b8cf3c2b284c2060c3bc5defd45"`);
        await queryRunner.query(`ALTER TABLE "education_detail" DROP CONSTRAINT "FK_0858e6c25a9a8eea4d94e55aa5a"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_77af458165fe750934e8425031b"`);
        await queryRunner.query(`DROP TABLE "experience_detail"`);
        await queryRunner.query(`DROP INDEX "REL_0858e6c25a9a8eea4d94e55aa5" ON "education_detail"`);
        await queryRunner.query(`DROP TABLE "education_detail"`);
        await queryRunner.query(`DROP TABLE "candidate_skill_set"`);
        await queryRunner.query(`DROP TABLE "skill_set"`);
        await queryRunner.query(`DROP INDEX "REL_77af458165fe750934e8425031" ON "candidate"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
