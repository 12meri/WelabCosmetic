import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/AuthenticationService';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthenticationService)
  if (auth.isAuthentified) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.token}` }
    })
  }
  return next(req)
}