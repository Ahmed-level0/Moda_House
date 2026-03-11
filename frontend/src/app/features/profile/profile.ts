import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ProfileService } from '../../core/services/profile.service';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
=======
import { TranslationService } from '../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

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
<<<<<<< HEAD
=======
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

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
<<<<<<< HEAD
        console.log('Update personal info called with:', name, phone);
        // ProfileService.updateProfile was specific to Node.js backend
        // Update this once Django equivalent is known
        alert('Update functionality is being aligned with the new backend.');
=======
        if (!name) {
            alert(this.t('profile.alert_name_required'));
            return;
        }
        this.profileService.updateProfile({ name, phone }).subscribe({
            next: () => {
                alert(this.t('profile.alert_profile_updated'));
            },
            error: (err) => {
                console.error('Update failed', err);
                alert(this.t('profile.alert_profile_failed'));
            }
        });
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
    }

    updatePassword(pass1: string, pass2: string) {
        if (!pass1 || !pass2) {
<<<<<<< HEAD
            alert('Please fill in both password fields.');
            return;
        }
        if (pass1 !== pass2) {
            alert('Passwords do not match.');
=======
            alert(this.t('profile.alert_pass_required'));
            return;
        }
        if (pass1 !== pass2) {
            alert(this.t('profile.alert_pass_mismatch'));
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
            return;
        }

        this.authService.changePassword(pass1, pass2).subscribe({
            next: () => {
<<<<<<< HEAD
                alert('Password updated successfully!');
            },
            error: (err) => {
                console.error('Password update failed', err);
                const errorMsg = err.error?.detail || 'Failed to update password. Please check your current authentication.';
=======
                alert(this.t('profile.alert_pass_updated'));
            },
            error: (err) => {
                console.error('Password update failed', err);
                const errorMsg = err.error?.detail || this.t('profile.alert_profile_failed');
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
                alert(errorMsg);
            }
        });
    }

    saveAddress() {
<<<<<<< HEAD
        console.log('Save address called');
        // Update this once Django equivalent is known
    }

    deleteAddress(id: number) {
        console.log('Delete address called for id:', id);
        // Update this once Django equivalent is known
=======
        if (!this.newAddress.content) {
            alert(this.t('profile.alert_address_details'));
            return;
        }
        this.profileService.addAddress(this.newAddress).subscribe({
            next: () => {
                this.showAddAddressForm.set(false);
                this.newAddress = { address_type: 'Home', content: '' };
                alert(this.t('profile.alert_address_saved'));
            },
            error: (err) => {
                console.error('Save address failed', err);
                alert(this.t('profile.alert_address_failed'));
            }
        });
    }

    deleteAddress(id: number) {
        if (confirm(this.t('profile.confirm_delete_address'))) {
            this.profileService.deleteAddress(id).subscribe({
                next: () => {
                    alert(this.t('profile.alert_address_deleted'));
                },
                error: (err) => {
                    console.error('Delete address failed', err);
                    alert(this.t('profile.alert_address_delete_failed'));
                }
            });
        }
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
    }
}
