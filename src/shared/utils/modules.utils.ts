import { ValueProvider } from '@nestjs/common';
import { ConfigFactory, ConfigFactoryKeyHost } from '@nestjs/config';

export function toValueProvider(
  namedspacedConfig: ConfigFactory & ConfigFactoryKeyHost
): ValueProvider {
  return { provide: namedspacedConfig.KEY, useValue: namedspacedConfig() };
}
