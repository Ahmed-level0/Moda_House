import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Address, AuthService, Profile, User } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = `${environment.apiUrl}/api/me/`;

    getUserInfo(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    private refreshUser(): Observable<any> {
        return this.authService.getUserProfile().pipe(
            tap(user => {
                (this.authService as any)._user.set(user);
                this.authService.saveToStorage();
            })
        );
    }
}
