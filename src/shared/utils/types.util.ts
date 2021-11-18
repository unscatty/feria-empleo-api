/* eslint-disable @typescript-eslint/ban-types */
export type StringEnum = { [k: string]: string };

export type OnlyMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? P : never }[keyof T];
export type OnlyMethods<T> = Pick<T, OnlyMethodKeys<T>>;

export type OnlyPropertyKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
export type OnlyProperties<T> = Pick<T, OnlyPropertyKeys<T>>;

export type RemoveTimeStamps<Model> = Omit<
  OnlyProperties<Model>,
  'createdAt' | 'updatedAt' | 'deletedAt'
>;
