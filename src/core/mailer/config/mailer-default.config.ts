import { EnvConfig } from 'src/config/config.keys';
import { Email } from '../interfaces';

// Has to be a function because process.env has not been initialized yet
export const defaultMailData = (): Partial<Email> => ({
  from: {
    name: 'Feria del empleo ESCOM',
    address: process.env[EnvConfig.EMAIL_FROM],
  },
});
