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

<<<<<<< HEAD
=======
    updateProfile(data: { name?: string, phone?: string }): Observable<any> {
        return this.http.patch<any>(`${environment.apiUrl}/api/me/`, data).pipe(
            tap(() => this.refreshUser().subscribe())
        );
    }

    addAddress(address: { address_type: string, content: string }): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/api/me/addresses/`, address).pipe(
            tap(() => this.refreshUser().subscribe())
        );
    }

    deleteAddress(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/api/me/addresses/${id}/`).pipe(
            tap(() => this.refreshUser().subscribe())
        );
    }

>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
    private refreshUser(): Observable<any> {
        return this.authService.getUserProfile().pipe(
            tap(user => {
                (this.authService as any)._user.set(user);
                this.authService.saveToStorage();
            })
        );
    }
}
