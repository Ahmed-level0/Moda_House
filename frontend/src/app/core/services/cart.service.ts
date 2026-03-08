import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CartItem {
    id: number;
    product: number; // For backend matching
    product_name?: string;
    name: string;
    brand: string;
    price: number;
    original_price?: number;
    discount?: number;
    image: string;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = `${environment.apiUrl}/api/cart/`;

    private _cartItems = signal<CartItem[]>([]);
    private _isDrawerOpen = signal<boolean>(false);
    private _discount = signal<number>(0);
    private _couponCode = signal<string | null>(null);

    // Read-only versions for external components
    cartItems = this._cartItems.asReadonly();
    isDrawerOpen = this._isDrawerOpen.asReadonly();
    discount = this._discount.asReadonly();
    couponCode = this._couponCode.asReadonly();

    // Computed signals
    subtotal = computed(() =>
        this._cartItems().reduce((total, item) => total + (item.price * item.quantity), 0)
    );

    totalCount = computed(() =>
        this._cartItems().reduce((total, item) => total + item.quantity, 0)
    );

    constructor() {
        this.loadFromStorage();

        // Initial fetch from backend if logged in
        if (this.authService.isLoggedIn()) {
            this.fetchCartFromBackend().subscribe();
        }

        // Auto-save whenever cart items change
        effect(() => {
            if (!this.authService.isLoggedIn()) {
                this.saveToStorage();
            }
        });
    }

    private getHeaders() {
        const token = this.authService.token();
        return new HttpHeaders({
            'Authorization': `Token ${token}`
        });
    }

    private formatImageUrl(url: string): string {
        if (!url) return '';
        if (url.startsWith('http://')) {
            return url.replace('http://', 'https://');
        }
        if (url.startsWith('/')) {
            return `${environment.apiUrl}${url}`;
        }
        return url;
    }

    fetchCartFromBackend() {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
            tap(res => {
                // Adapt Django response to frontend items
                const items = res.items.map((item: any) => ({
                    id: item.id,
                    product: item.product,
                    name: item.product_name,
                    price: item.product_price,
                    original_price: item.product_old_price || item.product_price,
                    discount: item.product_discount || 0,
                    image: this.formatImageUrl(item.product_image),
                    quantity: item.quantity
                }));
                this._cartItems.set(items);
                this._discount.set(res.discount || 0);
                this._couponCode.set(res.coupon?.code || null);
            })
        );
    }

    applyCoupon(code: string) {
        return this.http.post<any>(`${this.apiUrl}apply_coupon/`, { code }, { headers: this.getHeaders() }).pipe(
            tap(res => {
                // The API returns the updated cart
                this.fetchCartFromBackend().subscribe();
            })
        );
    }

    removeCoupon() {
        return this.http.post<any>(`${this.apiUrl}remove_coupon/`, {}, { headers: this.getHeaders() }).pipe(
            tap(res => {
                // Refresh the cart after removing the coupon
                this.fetchCartFromBackend().subscribe();
            })
        );
    }

    addToCart(product: any) {
        if (product.stock <= 0) {
            console.warn('Attempted to add out of stock item:', product.name);
            return;
        }

        if (this.authService.isLoggedIn()) {
            const payload = { product: product.id, quantity: product.quantity || 1 };
            this.http.post(`${this.apiUrl}add_item/`, payload, { headers: this.getHeaders() })
                .subscribe(() => this.fetchCartFromBackend().subscribe());
        } else {
            this._cartItems.update(items => {
                const existing = items.find(i => i.product === product.id);
                if (existing) {
                    return items.map(i => i.product === product.id
                        ? { ...i, quantity: i.quantity + (product.quantity || 1) }
                        : i
                    );
                }
                return [...items, {
                    id: Date.now(), // Temp id for local
                    product: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.final_price || product.price,
                    original_price: product.price,
                    discount: product.discount || 0,
                    image: this.formatImageUrl(product.image || product.image1),
                    quantity: product.quantity || 1
                }];
            });
        }
        this.toggleDrawer(true);
    }

    removeFromCart(productId: number) {
        if (this.authService.isLoggedIn()) {
            this.http.post(`${this.apiUrl}remove_item/`, { product: productId }, { headers: this.getHeaders() })
                .subscribe(() => this.fetchCartFromBackend().subscribe());
        } else {
            this._cartItems.update(items => items.filter(i => i.product !== productId));
        }
    }

    updateQuantity(productId: number, delta: number) {
        const item = this._cartItems().find(i => i.product === productId);
        if (!item) return;
        const newQty = Math.max(1, item.quantity + delta);

        if (this.authService.isLoggedIn()) {
            this.http.post(`${this.apiUrl}update_quantity/`, { product: productId, quantity: newQty }, { headers: this.getHeaders() })
                .subscribe(() => this.fetchCartFromBackend().subscribe());
        } else {
            this._cartItems.update(items => items.map(i => i.product === productId ? { ...i, quantity: newQty } : i));
        }
    }

    checkout(data: { phone: string, address: string, city: string, payment_method?: string, card_data?: any }) {
        return this.http.post<any>(`${this.apiUrl}checkout/`, data, { headers: this.getHeaders() });
    }

    getPaymentUrl(orderId: number) {
        return this.http.post<any>(`${environment.apiUrl}/api/payments/pay/${orderId}/`, {}, { headers: this.getHeaders() });
    }

    clearCart() {
        this._cartItems.set([]);
        this._discount.set(0);
        this._couponCode.set(null);
        localStorage.removeItem('moda_house_cart');
    }

    toggleDrawer(state?: boolean) {
        this._isDrawerOpen.set(state ?? !this._isDrawerOpen());
    }

    private saveToStorage() {
        localStorage.setItem('moda_house_cart', JSON.stringify(this._cartItems()));
    }

    private loadFromStorage() {
        const saved = localStorage.getItem('moda_house_cart');
        if (saved) {
            try {
                this._cartItems.set(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading cart from storage', e);
            }
        }
    }
}
