import {MigrationInterface, QueryRunner} from "typeorm";

export class candidateTables1626322467419 implements MigrationInterface {
    name = 'candidateTables1626322467419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `candidate` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(25) NOT NULL, `lastname` varchar(50) NOT NULL, `currentSalary` float NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `user_id` int NOT NULL, UNIQUE INDEX `REL_77af458165fe750934e8425031` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `skill_set` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `candidate_skill_set` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `education_detail` (`id` int NOT NULL AUTO_INCREMENT, `institutionName` varchar(50) NOT NULL, `city` varchar(50) NOT NULL, `degree` varchar(50) NOT NULL, `startDate` date NOT NULL, `endDate` date NULL, `description` varchar(250) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `candidate_id` int NOT NULL, UNIQUE INDEX `REL_0858e6c25a9a8eea4d94e55aa5` (`candidate_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `experience_detail` (`id` int NOT NULL AUTO_INCREMENT, `isCurrentjob` bit NOT NULL, `startDate` date NOT NULL, `endDate` date NULL, `jobTitle` varchar(50) NOT NULL, `jobDescription` varchar(250) NOT NULL, `companyName` varchar(50) NOT NULL, `jobAdress` varchar(250) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `update_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `candidate_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `candidate` ADD CONSTRAINT `FK_77af458165fe750934e8425031b` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `education_detail` ADD CONSTRAINT `FK_0858e6c25a9a8eea4d94e55aa5a` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `experience_detail` ADD CONSTRAINT `FK_b8cf3c2b284c2060c3bc5defd45` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `experience_detail` DROP FOREIGN KEY `FK_b8cf3c2b284c2060c3bc5defd45`");
        await queryRunner.query("ALTER TABLE `education_detail` DROP FOREIGN KEY `FK_0858e6c25a9a8eea4d94e55aa5a`");
        await queryRunner.query("ALTER TABLE `candidate` DROP FOREIGN KEY `FK_77af458165fe750934e8425031b`");
        await queryRunner.query("DROP TABLE `experience_detail`");
        await queryRunner.query("DROP INDEX `REL_0858e6c25a9a8eea4d94e55aa5` ON `education_detail`");
        await queryRunner.query("DROP TABLE `education_detail`");
        await queryRunner.query("DROP TABLE `candidate_skill_set`");
        await queryRunner.query("DROP TABLE `skill_set`");
        await queryRunner.query("DROP INDEX `REL_77af458165fe750934e8425031` ON `candidate`");
        await queryRunner.query("DROP TABLE `candidate`");
    }

}
