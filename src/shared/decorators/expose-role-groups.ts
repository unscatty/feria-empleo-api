/* eslint-disable @typescript-eslint/ban-types */
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { RoleGroup } from '../../modules/user/entities/role.entity';

// Merge @Expose groups with `defaultGroups` if present
export const ExposeDefaultGroups = (defaultGroups: string[]): ClassDecorator => {
  return function (target: Function): void {
    // Get metadata that has been set from Expose decorator applied to properties
    const exposedMetadatas = defaultMetadataStorage.getExposedMetadatas(target);

    // Merge metadata groups
    exposedMetadatas.forEach((metadata) => {
      const groups = metadata.options.groups;

      if (groups?.length > 0) {
        // Groups are present, append defaultGroups values and remove duplicates
        const mergedGroups = Array.from(new Set(defaultGroups.concat(groups)));
        // Override groups with merged groups
        metadata.options.groups = mergedGroups;
      }
    });
  };
};

export const ExposeAdminDefault: ClassDecorator = <TFunction extends Function>(
  target: TFunction
): TFunction | void => {
  return ExposeDefaultGroups([RoleGroup.ADMIN])(target);
};
