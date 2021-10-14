import { ValueProvider } from '@nestjs/common';
import { ConfigFactory, ConfigFactoryKeyHost } from '@nestjs/config';

export function toValueProvider<T extends ConfigFactory & ConfigFactoryKeyHost>(
  namedspacedConfig: T
): ValueProvider {
  return { provide: namedspacedConfig.KEY, useValue: namedspacedConfig() };
}
