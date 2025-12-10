import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorator/public.decorator';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      // For public routes, try to extract user from token if present
      // but don't require authentication
      const result = super.canActivate(context);
      
      // Handle Promise result
      if (result instanceof Promise) {
        return result.catch(() => {
          // If token is invalid or missing, allow access but without user
          return true;
        });
      }
      
      // Handle Observable result
      if (result instanceof Observable) {
        return result.pipe(
          catchError(() => {
            // If observable errors, allow access but without user
            return of(true);
          })
        );
      }
      
      // If it's a boolean, return it
      return result;
    }
    
    return super.canActivate(context);
  }
}
