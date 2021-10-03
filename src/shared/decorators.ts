import { Exclude, ExcludeOptions, Expose, ExposeOptions } from 'class-transformer';

export const ExposeToPlain = (options?: ExposeOptions) => Expose({ ...options, toPlainOnly: true });

export const ExcludeToPlain = (options?: ExcludeOptions) =>
  Exclude({ ...options, toPlainOnly: true });
