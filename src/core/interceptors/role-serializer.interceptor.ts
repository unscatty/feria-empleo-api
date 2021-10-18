import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  PlainLiteralObject,
} from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
// Same functionality as ClassSerializerInterceptor but adds user role groups to transform options
export class RoleSerializerInterceptor
  extends ClassSerializerInterceptor
  implements NestInterceptor
{
  // Add role group to class transformation
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user = context.switchToHttp().getRequest().user as User;
    const roleGroup = user?.roleGroup;

    const contextOptions = this.getContextOptions(context);
    const options: ClassTransformOptions = {
      ...this.defaultOptions,
      ...contextOptions,
    };

    if (roleGroup) {
      if (!options.groups || options.groups.length === 0) {
        options.groups = [roleGroup];
        // options.groups = groups;
      } else if (options.groups.length > 0) {
        // Add role group if not present
        if (options.groups.indexOf(roleGroup) === -1) {
          options.groups.push(roleGroup);
        }
      }
    }

    return next
      .handle()
      .pipe(
        map((res: PlainLiteralObject | Array<PlainLiteralObject>) => this.serialize(res, options))
      );
  }
}
