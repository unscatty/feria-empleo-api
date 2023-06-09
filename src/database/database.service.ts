import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        synchronize: config.get('NODE_ENV') != 'production',
        namingStrategy: new SnakeNamingStrategy(),
        options: {
          trustServerCertificate: true,
        },
      } as ConnectionOptions),
    inject: [ConfigService],
  }),
];
