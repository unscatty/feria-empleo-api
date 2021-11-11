import { registerAs } from '@nestjs/config';
import { EnvConfig } from 'src/config/config.keys';
import { SendGridModuleOptions } from '../../modules/sendgrid/implementation/sendgrid.interfaces';
import { mailerDefaultFrom } from '../defaults.config';

export default registerAs(
  'sendgridConfig',
  (): SendGridModuleOptions => ({
    apikey: process.env[EnvConfig.SEND_GRID_API_KEY],
    defaultMailData: {
      from: mailerDefaultFrom,
    },
  })
);
