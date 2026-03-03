import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProfileService } from '../../core/services/profile.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private cartService = inject(CartService);
    private profileService = inject(ProfileService);
    private http = inject(HttpClient);
    private router = inject(Router);

    user = this.authService.user;
    orders = signal<any[]>([]);
    filterDate = signal<string>('');

    filteredOrders = computed(() => {
        const date = this.filterDate();
        const allOrders = this.orders();
        if (!date) return allOrders;

        return allOrders.filter(order => {
            const orderDate = new Date(order.created).toISOString().split('T')[0];
            return orderDate === date;
        });
    });

    primaryAddress = computed(() => {
        const u = this.user();
        if (!u || !u.addresses || u.addresses.length === 0) return null;
        return u.addresses.find(a => a.is_default) || u.addresses[0];
    });

    // UI States
    activeTab = signal('overview');
    isSidebarCollapsed = signal(false);
    expandedOrderId = signal<string | null>(null);

    // Visibility States
    showOldPassword = signal(false);
    showNewPassword = signal(false);
    showConfirmPassword = signal(false);

    ngOnInit() {
        // user info is already fetched by AuthService on login/load
    }

    loadOrders() {
        // Orders are now part of the user signal from /me/
        const u = this.user();
        if (u && (u as any).orders) {
            const sortedOrders = [...(u as any).orders].sort((a, b) =>
                new Date(b.created).getTime() - new Date(a.created).getTime()
            );
            this.orders.set(sortedOrders);
        }
    }

    clearFilter() {
        this.filterDate.set('');
    }

    profileCompletion = computed(() => {
        let score = 0;
        const u = this.user();
        if (!u) return 0;

        if (u.username) score += 25;
        if (u.email) score += 25;
        if (u.profile?.phone) score += 25;
        if (u.addresses && u.addresses.length > 0) score += 25;

        return score;
    });

    toggleSidebar() {
        this.isSidebarCollapsed.update(v => !v);
    }

    setTab(tab: string) {
        this.activeTab.set(tab);
        if (tab === 'orders') {
            this.loadOrders();
        }
    }

    toggleOrder(id: string) {
        this.expandedOrderId.update(v => v === id ? null : id);
    }

    toggleVisibility(type: 'old' | 'new' | 'confirm') {
        if (type === 'old') this.showOldPassword.update(v => !v);
        if (type === 'new') this.showNewPassword.update(v => !v);
        if (type === 'confirm') this.showConfirmPassword.update(v => !v);
    }

    reorder(order: any) {
        order.items.forEach((item: any) => {
            // Need to fetch full product details if item doesn't have them
            // For now assume item has enough info or user will fix in cart
            this.cartService.addToCart(item);
        });
        this.router.navigate(['/cart']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    // New methods for settings
    showAddAddressForm = signal(false);
    newAddress = {
        address_type: 'Home' as 'Home' | 'Work' | 'Other',
        content: ''
    };

    updatePersonalInfo(name: string, phone: string) {
        console.log('Update personal info called with:', name, phone);
        // ProfileService.updateProfile was specific to Node.js backend
        // Update this once Django equivalent is known
        alert('Update functionality is being aligned with the new backend.');
    }

    updatePassword(pass1: string, pass2: string) {
        if (!pass1 || !pass2) {
            alert('Please fill in both password fields.');
            return;
        }
        if (pass1 !== pass2) {
            alert('Passwords do not match.');
            return;
        }

        this.authService.changePassword(pass1, pass2).subscribe({
            next: () => {
                alert('Password updated successfully!');
            },
            error: (err) => {
                console.error('Password update failed', err);
                const errorMsg = err.error?.detail || 'Failed to update password. Please check your current authentication.';
                alert(errorMsg);
            }
        });
    }

    saveAddress() {
        console.log('Save address called');
        // Update this once Django equivalent is known
    }

    deleteAddress(id: number) {
        console.log('Delete address called for id:', id);
        // Update this once Django equivalent is known
    }
}
