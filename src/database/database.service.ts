import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { EnvConfig } from '../config/config.keys';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) =>
      ({
        ssl: false,
        type: config.get(EnvConfig.DB_CONNECTION),
        host: config.get(EnvConfig.DB_HOST),
        port: parseInt(config.get(EnvConfig.DB_PORT), 10),
        username: config.get(EnvConfig.DB_USERNAME),
        password: config.get(EnvConfig.DB_PASSWORD),
        database: config.get(EnvConfig.DB_DATABASE),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
        options: {
          trustServerCertificate: true,
        },
      } as ConnectionOptions),
    inject: [ConfigService],
  }),
];
