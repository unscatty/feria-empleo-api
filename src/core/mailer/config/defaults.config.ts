import { EnvConfig } from 'src/config/config.keys';

export const mailerDefaultFrom = `"Feria del empleo ESCOM" <${process.env[EnvConfig.EMAIL_FROM]}>`;
