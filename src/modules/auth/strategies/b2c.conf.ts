/* import { config } from 'dotenv';
import { IBearerStrategyOptionWithRequest } from 'passport-azure-ad';

config();

export const B2COptions: IBearerStrategyOptionWithRequest = {
  identityMetadata: process.env.B2C_METADATA,
  clientID: process.env.B2C_CLIENT_ID,
  policyName: process.env.B2C_POLICY_NAME,
  isB2C: true,
  validateIssuer: false,
  loggingLevel: 'warn',
  loggingNoPII: false,
  passReqToCallback: true,
  allowMultiAudiencesInToken: true,
  audience: process.env.B2C_CLIENT_ID,
};

export const B2CCallback = (req: any, token: any, done: any) => {
  if (!token.oid)
    done(new Error('Expected oid in token but no token/id found.'));
  else {
    done(undefined, token, {
      id: token.oid,
    });
  }
};
 */
