import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token();

    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Token ${token}`
            }
        });
        return next(authReq);
    }

    return next(req);
};
