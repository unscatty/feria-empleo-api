import { CustomDecorator, SetMetadata } from '@nestjs/common';

/**
 *
 *  Decorator to make public endpoint
 */
export const Public = (): CustomDecorator<string> =>
  SetMetadata('public', true);
