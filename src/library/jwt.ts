import * as jwt from 'jsonwebtoken';

export class JWT {
  public static sign(data: string): string {
    return jwt.sign(data, process.env.JWT_SECRET);
  }
}
