import { registerAs } from '@nestjs/config';
import { EnvConfig } from 'src/config/config.keys';
import toSendgridMailData from 'src/shared/utils/mailer/sendgrid.util';
import { SendGridModuleOptions } from '../../modules/sendgrid/implementation/sendgrid.interfaces';
import { defaultMailData } from '../mailer-default.config';

export default registerAs(
  'sendgridConfig',
  (): SendGridModuleOptions => ({
    apikey: process.env[EnvConfig.SEND_GRID_API_KEY],
    defaultMailData: toSendgridMailData(defaultMailData()),
  })
);
