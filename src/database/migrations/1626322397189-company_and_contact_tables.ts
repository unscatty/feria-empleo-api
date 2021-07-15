import {MigrationInterface, QueryRunner} from "typeorm";

export class companyAndContactTables1626322397189 implements MigrationInterface {
    name = 'companyAndContactTables1626322397189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `contact_detail` (`id` int NOT NULL AUTO_INCREMENT, `phone` varchar(15) NOT NULL, `web_site` varchar(255) NULL, `address` varchar(255) NULL, `linkedin_url` varchar(255) NULL, `facebook_url` varchar(255) NULL, `github_url` varchar(255) NULL, `user_id` int NOT NULL, UNIQUE INDEX `REL_d005a3853116005286403c75ff` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `company` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NULL, `image_url` varchar(255) NULL, `video_url` varchar(255) NULL, `staff` varchar(255) NULL, `user_id` int NOT NULL, UNIQUE INDEX `REL_879141ebc259b4c0544b3f1ea4` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `contact_detail` ADD CONSTRAINT `FK_d005a3853116005286403c75ff2` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `company` ADD CONSTRAINT `FK_879141ebc259b4c0544b3f1ea4c` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `company` DROP FOREIGN KEY `FK_879141ebc259b4c0544b3f1ea4c`");
        await queryRunner.query("ALTER TABLE `contact_detail` DROP FOREIGN KEY `FK_d005a3853116005286403c75ff2`");
        await queryRunner.query("DROP INDEX `REL_879141ebc259b4c0544b3f1ea4` ON `company`");
        await queryRunner.query("DROP TABLE `company`");
        await queryRunner.query("DROP INDEX `REL_d005a3853116005286403c75ff` ON `contact_detail`");
        await queryRunner.query("DROP TABLE `contact_detail`");
    }

}
