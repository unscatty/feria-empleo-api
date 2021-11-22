import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1637564855944 implements MigrationInterface {
    name = 'initialMigration1637564855944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "uploaded_image" ("id" int NOT NULL IDENTITY(1,1), "image_url" varchar(500) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_fd44cfd5027f489c6b08a8a0f4c" DEFAULT getdate(), CONSTRAINT "PK_fe1edbbe028d66202a748bcf4be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate_skill_set" ("candidate_id" int NOT NULL, "skill_set_id" int NOT NULL, "level" int, "created_at" datetime NOT NULL CONSTRAINT "DF_66bf39a081a7d75bb39220f69c5" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_e9ad4603d71b367a345bd563de3" DEFAULT getdate(), CONSTRAINT "PK_b7267d50437d0487dfe7e45b697" PRIMARY KEY ("candidate_id", "skill_set_id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) CONSTRAINT CHK_8be7983fff40873bf4ed466097_ENUM CHECK(name IN ('ADMIN','CANDIDATE','COMPANY')) NOT NULL CONSTRAINT "DF_ae4578dcaed5adff96595e61660" DEFAULT 'CANDIDATE', "created_at" datetime NOT NULL CONSTRAINT "DF_3e267a94bab0461665be604cb16" DEFAULT getdate(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_detail" ("id" int NOT NULL IDENTITY(1,1), "phone" varchar(15) NOT NULL, "web_site" varchar(255), "address" varchar(255), "linkedin_url" varchar(255), "facebook_url" varchar(255), "github_url" varchar(255), "created_at" datetime NOT NULL CONSTRAINT "DF_c2d0137b4a37e643c843e8379d5" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_4860097dc5dc7f61418b7eda909" DEFAULT getdate(), "user_id" int NOT NULL, CONSTRAINT "PK_9781aa590b725ffa4631d4566b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_d005a3853116005286403c75ff" ON "contact_detail" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "email" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "lastname" varchar(255) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_d091f1d36f18bbece2a9eabc6e0" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_9cdce43fa0043c794281aa09051" DEFAULT getdate(), "role_id" int NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(255) NOT NULL, "invitation_email" varchar(255) NOT NULL, "active_email" varchar(255) NOT NULL, "description" varchar(255), "video_url" varchar(255), "staff" varchar(255), "is_active" bit NOT NULL CONSTRAINT "DF_ead03c03465e180af9fcc725011" DEFAULT 1, "state" nvarchar(255) NOT NULL CONSTRAINT "DF_a58bfbe920f080ecd3dd2301f58" DEFAULT 'INVITED', "created_at" datetime NOT NULL CONSTRAINT "DF_688e0b1c1aab287bb6867e15e7e" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_c1dc0c2fcb6f9d6c2cf1c3d2371" DEFAULT getdate(), "image_id" int, "user_id" int, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_6ab2cb6d2e7bbc45e236dfffc4" ON "company" ("image_id") WHERE "image_id" IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_879141ebc259b4c0544b3f1ea4" ON "company" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "job_post_tag" ("job_post_id" int NOT NULL, "tag_id" int NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_4e4f18d1a31953a9c1af4f8d7e9" DEFAULT getdate(), CONSTRAINT "PK_9574ced1daa95900e31291d4103" PRIMARY KEY ("job_post_id", "tag_id"))`);
        await queryRunner.query(`CREATE TABLE "skill_set" ("id" int NOT NULL IDENTITY(1,1), "name" varchar(50) NOT NULL, "slug" varchar(50) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_52375ae40c25b9a189697f5c571" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_9413893375567eb564bbbee8f6a" DEFAULT getdate(), CONSTRAINT "UQ_4e635f2810416fa14b874acbe7c" UNIQUE ("slug"), CONSTRAINT "PK_d94825f899a97846bca90d9952e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_post" ("id" int NOT NULL IDENTITY(1,1), "is_active" bit NOT NULL CONSTRAINT "DF_691bba5337e93ae2c382bfeb06f" DEFAULT 1, "job_title" nvarchar(255) NOT NULL, "description" nvarchar(500) NOT NULL, "requirements" nvarchar(3000), "experience" nvarchar(255), "job_type" nvarchar(255) CONSTRAINT CHK_c07b44c334508d1b78a7dfc903_ENUM CHECK(job_type IN ('full_time','part_time')) NOT NULL, "job_mode" nvarchar(255) CONSTRAINT CHK_ffd2e8ab6952b89c8b70a2e02c_ENUM CHECK(job_mode IN ('office','hybrid','home_office')) NOT NULL, "salary_min" int, "salary_max" int, "views" int NOT NULL CONSTRAINT "DF_e1836480522e62672be66a71195" DEFAULT 0, "created_at" datetime NOT NULL CONSTRAINT "DF_441228601b0e11801671734186c" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_ef22222cb5ceff082b1d7e3a08d" DEFAULT getdate(), "image_id" int, "company_id" int, CONSTRAINT "PK_a70f902a85e6de57340d153c813" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_416298653f9eb3c20249f75099" ON "job_post" ("image_id") WHERE "image_id" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "job_application" ("created_at" datetime NOT NULL CONSTRAINT "DF_68362814a309b61b41c66f92d34" DEFAULT getdate(), "candidate_id" int NOT NULL, "job_post_id" int NOT NULL, CONSTRAINT "PK_e07522976e5c7354527a71faabb" PRIMARY KEY ("candidate_id", "job_post_id"))`);
        await queryRunner.query(`CREATE TABLE "education_detail" ("id" int NOT NULL IDENTITY(1,1), "institution_name" varchar(50) NOT NULL, "degree" varchar(50) NOT NULL, "level" varchar(50) NOT NULL, "start_date" date NOT NULL, "end_date" date, "currently_in_school" bit, "description" varchar(250), "created_at" datetime NOT NULL CONSTRAINT "DF_59fb929ed450e9e168bc8db4436" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_e4ff11d2fd49b9890abb331e64e" DEFAULT getdate(), "candidate_id" int NOT NULL, CONSTRAINT "PK_8195337eac4ff2bc6defc59c818" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience_detail" ("id" int NOT NULL IDENTITY(1,1), "is_currentjob" bit NOT NULL CONSTRAINT "DF_3e7ff4bb4707d816ab69ab17f01" DEFAULT 0, "start_date" date NOT NULL, "end_date" date, "job_title" varchar(50) NOT NULL, "job_description" varchar(250) NOT NULL, "company_name" varchar(50) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_9399b4fb43c48cd9f65317618e9" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_bd2f93c0aaf7ca12c2c7e0423bb" DEFAULT getdate(), "candidate_id" int NOT NULL, CONSTRAINT "PK_3b2e0758ad577cdee403e132e86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate" ("id" int NOT NULL IDENTITY(1,1), "current_salary" float, "resume" varchar(255), "created_at" datetime NOT NULL CONSTRAINT "DF_3450070c4ea9d3816a7d5cdc3f6" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_629d63f227e9b0b6cf202a29300" DEFAULT getdate(), "user_id" int NOT NULL, CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_77af458165fe750934e8425031" ON "candidate" ("user_id") WHERE "user_id" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" DROP CONSTRAINT "DF_4e4f18d1a31953a9c1af4f8d7e9"`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP CONSTRAINT "DF_66bf39a081a7d75bb39220f69c5"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP CONSTRAINT "DF_e9ad4603d71b367a345bd563de3"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD "level" int`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD "created_at" datetime NOT NULL CONSTRAINT "DF_66bf39a081a7d75bb39220f69c5" DEFAULT getdate()`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD "updated_at" datetime NOT NULL CONSTRAINT "DF_e9ad4603d71b367a345bd563de3" DEFAULT getdate()`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" ADD "created_at" datetime NOT NULL CONSTRAINT "DF_4e4f18d1a31953a9c1af4f8d7e9" DEFAULT getdate()`);
        await queryRunner.query(`CREATE INDEX "IDX_6464ec5523c6301210a264ed57" ON "job_post_tag" ("job_post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a362e1b004140b6638e01041b4" ON "job_post_tag" ("tag_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_eae19d3bff530ec2cfc7cee755" ON "candidate_skill_set" ("candidate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_dce1e62cfb746fd43dbbd6e400" ON "candidate_skill_set" ("skill_set_id") `);
        await queryRunner.query(`ALTER TABLE "contact_detail" ADD CONSTRAINT "FK_d005a3853116005286403c75ff2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_6ab2cb6d2e7bbc45e236dfffc40" FOREIGN KEY ("image_id") REFERENCES "uploaded_image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_416298653f9eb3c20249f750993" FOREIGN KEY ("image_id") REFERENCES "uploaded_image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_9d7fb58aa78330e7a8f2dacfeb7" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application" ADD CONSTRAINT "FK_451f4e4120357dbd64a9a3aca8f" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application" ADD CONSTRAINT "FK_56618ed1b5ed93dab4c0747f83f" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education_detail" ADD CONSTRAINT "FK_0858e6c25a9a8eea4d94e55aa5a" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_detail" ADD CONSTRAINT "FK_b8cf3c2b284c2060c3bc5defd45" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_77af458165fe750934e8425031b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" ADD CONSTRAINT "FK_6464ec5523c6301210a264ed579" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" ADD CONSTRAINT "FK_a362e1b004140b6638e01041b41" FOREIGN KEY ("tag_id") REFERENCES "skill_set"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD CONSTRAINT "FK_eae19d3bff530ec2cfc7cee7552" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD CONSTRAINT "FK_dce1e62cfb746fd43dbbd6e400e" FOREIGN KEY ("skill_set_id") REFERENCES "skill_set"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP CONSTRAINT "FK_dce1e62cfb746fd43dbbd6e400e"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP CONSTRAINT "FK_eae19d3bff530ec2cfc7cee7552"`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" DROP CONSTRAINT "FK_a362e1b004140b6638e01041b41"`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" DROP CONSTRAINT "FK_6464ec5523c6301210a264ed579"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_77af458165fe750934e8425031b"`);
        await queryRunner.query(`ALTER TABLE "experience_detail" DROP CONSTRAINT "FK_b8cf3c2b284c2060c3bc5defd45"`);
        await queryRunner.query(`ALTER TABLE "education_detail" DROP CONSTRAINT "FK_0858e6c25a9a8eea4d94e55aa5a"`);
        await queryRunner.query(`ALTER TABLE "job_application" DROP CONSTRAINT "FK_56618ed1b5ed93dab4c0747f83f"`);
        await queryRunner.query(`ALTER TABLE "job_application" DROP CONSTRAINT "FK_451f4e4120357dbd64a9a3aca8f"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_9d7fb58aa78330e7a8f2dacfeb7"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_416298653f9eb3c20249f750993"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_6ab2cb6d2e7bbc45e236dfffc40"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "contact_detail" DROP CONSTRAINT "FK_d005a3853116005286403c75ff2"`);
        await queryRunner.query(`DROP INDEX "IDX_dce1e62cfb746fd43dbbd6e400" ON "candidate_skill_set"`);
        await queryRunner.query(`DROP INDEX "IDX_eae19d3bff530ec2cfc7cee755" ON "candidate_skill_set"`);
        await queryRunner.query(`DROP INDEX "IDX_a362e1b004140b6638e01041b4" ON "job_post_tag"`);
        await queryRunner.query(`DROP INDEX "IDX_6464ec5523c6301210a264ed57" ON "job_post_tag"`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" DROP CONSTRAINT "DF_4e4f18d1a31953a9c1af4f8d7e9"`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP CONSTRAINT "DF_e9ad4603d71b367a345bd563de3"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP CONSTRAINT "DF_66bf39a081a7d75bb39220f69c5"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD "updated_at" datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD CONSTRAINT "DF_e9ad4603d71b367a345bd563de3" DEFAULT getdate() FOR "updated_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD "created_at" datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD CONSTRAINT "DF_66bf39a081a7d75bb39220f69c5" DEFAULT getdate() FOR "created_at"`);
        await queryRunner.query(`ALTER TABLE "candidate_skill_set" ADD "level" int`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" ADD "created_at" datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_post_tag" ADD CONSTRAINT "DF_4e4f18d1a31953a9c1af4f8d7e9" DEFAULT getdate() FOR "created_at"`);
        await queryRunner.query(`DROP INDEX "REL_77af458165fe750934e8425031" ON "candidate"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
        await queryRunner.query(`DROP TABLE "experience_detail"`);
        await queryRunner.query(`DROP TABLE "education_detail"`);
        await queryRunner.query(`DROP TABLE "job_application"`);
        await queryRunner.query(`DROP INDEX "REL_416298653f9eb3c20249f75099" ON "job_post"`);
        await queryRunner.query(`DROP TABLE "job_post"`);
        await queryRunner.query(`DROP TABLE "skill_set"`);
        await queryRunner.query(`DROP TABLE "job_post_tag"`);
        await queryRunner.query(`DROP INDEX "REL_879141ebc259b4c0544b3f1ea4" ON "company"`);
        await queryRunner.query(`DROP INDEX "REL_6ab2cb6d2e7bbc45e236dfffc4" ON "company"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "REL_d005a3853116005286403c75ff" ON "contact_detail"`);
        await queryRunner.query(`DROP TABLE "contact_detail"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "candidate_skill_set"`);
        await queryRunner.query(`DROP TABLE "uploaded_image"`);
    }

}
