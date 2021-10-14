import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TransitionCantBeAppliedException } from '@depthlabs/nestjs-state-machine/dist/exceptions/transition-cant-be-applied.exception';

@Injectable()
export class StateMachineExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof TransitionCantBeAppliedException) {
          return throwError(new ForbiddenException('CANNOT_APPLY_TRANSITION', error.message));
        }

        return throwError(error);
      })
    );
  }
}
