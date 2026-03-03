import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    activeSection = signal<'profile' | 'password' | 'store'>('profile');

    // Profile Data
    profileData = {
        username: signal(''),
        email: signal(''),
    };

    // Password Data
    passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    // Store Settings
    storeSettings = {
        storeName: signal('Moda House'),
        storeEmail: signal('support@modahouse.com'),
        currency: signal('USD'),
        taxRate: signal(14)
    };

    loading = signal(false);
    message = signal<{ type: 'success' | 'error', text: string } | null>(null);

    ngOnInit() {
        const user = this.authService.user();
        if (user) {
            this.profileData.username.set(user.username);
            this.profileData.email.set(user.email);
        }
    }

    updateProfile() {
        this.showMessage('success', 'Profile updated successfully (Mock)');
    }

    changePassword() {
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
            this.showMessage('error', 'Passwords do not match');
            return;
        }
        this.showMessage('success', 'Password changed successfully (Mock)');
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }

    saveStoreSettings() {
        this.showMessage('success', 'Store settings saved successfully (Mock)');
    }

    private showMessage(type: 'success' | 'error', text: string) {
        this.message.set({ type, text });
        setTimeout(() => this.message.set(null), 3000);
    }
}
