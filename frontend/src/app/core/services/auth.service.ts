import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap, map, of, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Address {
    id: number;
    address_type: 'Home' | 'Work' | 'Other';
    content: string;
    is_default: boolean;
}

export interface Profile {
    phone?: string;
    bio?: string;
    avatar?: string;
}

export interface User {
    _id: string; // Keep for compatibility if needed elsewhere
    id?: string;
    username: string;
    email: string;
    role?: 'user' | 'admin';
    name?: string;
    profile?: Profile;
    addresses?: Address[];
    token?: string;
    orders?: any[]; // Added for Django /me/ response
    is_staff?: boolean; // Added for Django admin detection
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/auth/`;

    private _user = signal<User | null>(null);
    private _isLoggedIn = signal<boolean>(false);
    private _isAdmin = signal<boolean>(false);
    private _token = signal<string | null>(null);

    // Read-only versions
    user = this._user.asReadonly();
    isLoggedIn = this._isLoggedIn.asReadonly();
    isAdmin = this._isAdmin.asReadonly();
    token = this._token.asReadonly();

    constructor() {
        this.loadFromStorage();
    }

    login(credentials: { username?: string, email: string, password?: string }) {
        const payload = {
            username: credentials.username || credentials.email.split('@')[0],
            email: credentials.email,
            password: credentials.password
        };
        return this.http.post<{ key: string }>(`${this.apiUrl}login/`, payload).pipe(
            tap(res => {
                this._token.set(res.key);
                this._isLoggedIn.set(true);
                this.saveToStorage();
            }),
            switchMap(res => this.getUserProfile().pipe(
                map(() => res), // Still return the login response (key)
                catchError(err => {
                    console.error('Profile fetch failed after login', err);
                    // Still return success if login worked, just log the error
                    return of(res);
                })
            ))
        );
    }

    register(data: { username: string, email: string, password?: string }) {
        // Django documentation shows password1 and password2
        const payload = {
            username: data.username,
            email: data.email,
            password1: data.password,
            password2: data.password
        };
        return this.http.post<any>(`${this.apiUrl}register/`, payload).pipe(
            tap(res => {
                // Register usually returns some response, often needs login after or might return key
                // Based on PDF, if it returns 201 it's success.
            })
        );
    }

    // Load full profile if token exists but user details are needed/outdated
    getUserProfile(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/api/me/`).pipe(
            tap(userData => {
                this._user.set(userData);
                // Django uses is_staff for admin access
                this._isAdmin.set(userData.is_staff || userData.role === 'admin');
                this.saveToStorage();
            })
        );
    }

    logout() {
        const token = this._token();
        if (token) {
            this.http.post(`${this.apiUrl}logout/`, { key: token }).subscribe({
                next: () => this.clearAuth(),
                error: () => this.clearAuth() // Clear even if error
            });
        } else {
            this.clearAuth();
        }
    }

    changePassword(newPassword1: string, newPassword2: string) {
        const payload = {
            new_password1: newPassword1,
            new_password2: newPassword2
        };
        return this.http.post(`${this.apiUrl}password/change/`, payload);
    }

    private clearAuth() {
        this._user.set(null);
        this._isLoggedIn.set(false);
        this._isAdmin.set(false);
        this._token.set(null);
        localStorage.removeItem('moda_house_user');
        localStorage.removeItem('moda_house_token');
    }

    saveToStorage() {
        localStorage.setItem('moda_house_user', JSON.stringify(this._user()));
        localStorage.setItem('moda_house_token', this._token() || '');
    }

    private loadFromStorage() {
        const savedUser = localStorage.getItem('moda_house_user');
        const savedToken = localStorage.getItem('moda_house_token');
        if (savedToken) {
            this._token.set(savedToken);
            this._isLoggedIn.set(true);
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    this._user.set(user);
                    this._isAdmin.set(user.is_staff || user.role === 'admin');
                } catch (e) {
                    console.error('Error loading user from storage', e);
                }
            }
        }
    }
}

