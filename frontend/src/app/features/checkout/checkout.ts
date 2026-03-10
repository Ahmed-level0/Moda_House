import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './checkout.html',
    styleUrl: './checkout.scss'
})
export class CheckoutComponent {
    private cartService = inject(CartService);
    private router = inject(Router);
    private http = inject(HttpClient);
    public authService = inject(AuthService);
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }

    cartItems = this.cartService.cartItems;
    subtotal = this.cartService.subtotal;
    discount = this.cartService.discount;
    currentCoupon = this.cartService.couponCode;

    couponCodeInput = signal('');

    // Form Signals
    email = signal('');
    firstName = signal('');
    lastName = signal('');
    address = signal('');
    city = signal('');
    phone = signal('');
    paymentMethod = signal('cod');

    // Dynamic Shipping Logic
    shippingCost = computed(() => {
        const selectedCity = this.city().toLowerCase();
        if (!selectedCity) return 0;
        return (selectedCity === 'cairo' || selectedCity === 'giza') ? 50 : 80;
    });

    codFee = computed(() => this.paymentMethod() === 'cod' ? 100 : 0);

    orderTotal = computed(() => (this.subtotal() - this.discount()) + this.shippingCost() + this.codFee());

    // UI State
    isSummaryCollapsed = signal(true);
    showErrors = signal(false);
    isPlacingOrder = signal(false);

    toggleSummary() {
        this.isSummaryCollapsed.update(v => !v);
    }

    onCityChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.city.set(value);
    }

    updateField(field: 'email' | 'firstName' | 'lastName' | 'address' | 'phone' | 'couponCodeInput', event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (field === 'couponCodeInput') {
            this.couponCodeInput.set(value);
        } else {
            this[field].set(value);
        }
    }

    applyCoupon() {
        if (!this.couponCodeInput()) return;

        this.cartService.applyCoupon(this.couponCodeInput()).subscribe({
            next: (res) => {
                this.couponCodeInput.set('');
                // Success feedback if needed
            },
            error: (err) => {
                console.error('Failed to apply coupon:', err);
                alert(err.error?.detail || this.t('checkout.invalid_coupon'));
            }
        });
    }

    removeCoupon() {
        this.cartService.removeCoupon().subscribe({
            next: (res) => {
                // Refresh if needed, though signals should handle it
            },
            error: (err) => {
                console.error('Failed to remove coupon:', err);
            }
        });
    }

    validateForm() {
        return !!(this.email() && this.firstName() && this.lastName() && this.address() && this.city() && this.phone());
    }

    completeOrder() {
        if (!this.validateForm()) {
            this.showErrors.set(true);
            setTimeout(() => this.showErrors.set(false), 3000);
            return;
        }

        this.isPlacingOrder.set(true);

        const checkoutData = {
            phone: this.phone(),
            address: this.address(), // Just the address, city is separate
            city: this.city(),
            payment_method: this.paymentMethod(),
            card_data: null
        };

        // 1. Create Order via Cart checkout endpoint
        this.cartService.checkout(checkoutData).subscribe({
            next: (res: any) => {
                console.log('Checkout Response:', res);

                // Exhaustive ID retrieval
                const orderId = res.order_id

                if (this.paymentMethod() === 'cod') {
                    // For COD, always navigate to success if request succeeded
                    this.cartService.clearCart();
                    this.isPlacingOrder.set(false);
                    this.router.navigate(['/checkout/success'], { queryParams: { id: orderId } });
                } else {
                    this.cartService.getPaymentUrl(orderId).subscribe({
                        next: (payRes: any) => {
                            this.cartService.clearCart();
                            this.isPlacingOrder.set(false);
                            window.location.href = payRes.payment_url;
                        },
                        error: (payErr) => {
                            console.error('Failed to get payment URL:', payErr);
                            this.cartService.clearCart();
                            this.isPlacingOrder.set(false);
                            this.router.navigate(['/checkout/success'], { queryParams: { id: orderId } });
                        }
                    });
                }
            },
            error: (err) => {
                console.error('Order placement failed:', err);
                alert(err.error?.detail || this.t('checkout.order_failed'));
                this.isPlacingOrder.set(false);
            }
        });
    }
}
