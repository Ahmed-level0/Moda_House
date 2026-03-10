import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './auth.html',
    styleUrl: './auth.scss'
})
export class AuthComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }

    isLoginMode = signal(true);

    // Form Signals
    username = signal('');
    email = signal('');
    password = signal('');
    isAdmin = signal(false);

    // Feedback Signals
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    toggleMode() {
        this.isLoginMode.update(v => !v);
    }

    updateField(field: 'username' | 'email' | 'password', event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this[field].set(value);
        // Clear messages when user starts typing
        this.errorMessage.set(null);
        this.successMessage.set(null);
    }

    toggleAdmin(event: Event) {
        this.isAdmin.set((event.target as HTMLInputElement).checked);
    }

    onSubmit() {
        this.errorMessage.set(null);
        this.successMessage.set(null);

        if (this.isLoginMode()) {
            this.authService.login({
                username: this.username(), // Django often uses username for login or email
                email: this.email(),
                password: this.password()
            } as any).subscribe({
                next: () => {
                    // Redirect to profile after login success (AuthService handles fetching profile)
                    this.router.navigate(['/profile']);
                },
                error: (err) => {
                    console.error('Login failed', err);
                    this.errorMessage.set(err.error?.detail || this.t('auth.alert_login_failed'));
                }
            });
        } else {
            const data = {
                username: this.username(),
                email: this.email(),
                password: this.password()
            };
            this.authService.register(data).subscribe({
                next: () => {
                    this.successMessage.set(this.t('auth.alert_register_success'));
                    this.isLoginMode.set(true);
                },
                error: (err) => {
                    console.error('Registration failed', err);
                    this.errorMessage.set(err.error?.message || this.t('auth.alert_register_failed'));
                }
            });
        }
    }
}
