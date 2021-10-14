import {
  Exclude,
  ExcludeOptions,
  Expose,
  ExposeOptions,
  Transform,
  TransformFnParams,
  TransformOptions,
} from 'class-transformer';

export const ExposeToPlain = (options?: ExposeOptions) => Expose({ ...options, toPlainOnly: true });

export const ExcludeToPlain = (options?: ExcludeOptions) =>
  Exclude({ ...options, toPlainOnly: true });

export const TransformToPlain = (
  transformFn: (params: TransformFnParams) => any,
  options?: TransformOptions
) => Transform(transformFn, { ...options, toPlainOnly: true });
