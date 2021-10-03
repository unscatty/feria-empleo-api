import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';
import { User } from 'src/modules/user/entities/user.entity';
import { RoleGroup } from 'src/modules/user/entities/role.entity';

let classTransformer: any = {};

export interface PlainLiteralObject {
  [key: string]: any;
}

// NOTE (external)
// We need to deduplicate them here due to the circular dependency
// between core and common packages
const REFLECTOR = 'Reflector';

// Same functionaliyy as ClassSerializerInterceptor but adds user role groups to transform options
@Injectable()
export class RoleSerializerInterceptor implements NestInterceptor {
  constructor(
    @Inject(REFLECTOR) protected readonly reflector: any,
    @Optional() protected readonly defaultOptions: ClassTransformOptions = {}
  ) {
    classTransformer = loadPackage('class-transformer', 'ClassSerializerInterceptor', () =>
      require('class-transformer')
    );
    require('class-transformer');
  }

  // Add role group to class transformation
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user = context.switchToHttp().getRequest().user as User;
    const roleGroup = user?.roleGroup || RoleGroup.PUBLIC;

    const contextOptions = this.getContextOptions(context);
    const options: ClassTransformOptions = {
      ...this.defaultOptions,
      ...contextOptions,
    };

    if (!options.groups) {
      options.groups = [roleGroup];
    } else if (options.groups.length < 1) {
      if (options.groups.indexOf(roleGroup) === -1) {
        options.groups.push(roleGroup);
      }
    }

    return next
      .handle()
      .pipe(
        map((res: PlainLiteralObject | Array<PlainLiteralObject>) => this.serialize(res, options))
      );
  }

  serialize(
    response: PlainLiteralObject | Array<PlainLiteralObject>,
    options: ClassTransformOptions
  ): PlainLiteralObject | PlainLiteralObject[] {
    const isArray = Array.isArray(response);
    if (!isObject(response) && !isArray) {
      return response;
    }
    return isArray
      ? (response as PlainLiteralObject[]).map((item) => this.transformToPlain(item, options))
      : this.transformToPlain(response, options);
  }

  transformToPlain(plainOrClass: any, options: ClassTransformOptions): PlainLiteralObject {
    return plainOrClass && plainOrClass.constructor !== Object
      ? classTransformer.classToPlain(plainOrClass, options)
      : plainOrClass;
  }

  protected getContextOptions(context: ExecutionContext): ClassTransformOptions | undefined {
    return (
      this.reflectSerializeMetadata(context.getHandler()) ||
      this.reflectSerializeMetadata(context.getClass())
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private reflectSerializeMetadata(obj: object | Function): ClassTransformOptions | undefined {
    return this.reflector.get(CLASS_SERIALIZER_OPTIONS, obj);
  }
}
