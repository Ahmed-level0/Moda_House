import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartService } from './cart.service';

export interface WishlistItem {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    category: string;
    inStock?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private cartService = inject(CartService);
    private _wishlistItems = signal<WishlistItem[]>([]);

    // Read-only versions
    wishlistItems = this._wishlistItems.asReadonly();

    totalCount = computed(() => this._wishlistItems().length);

    constructor() {
        this.loadFromStorage();

        // Auto-save whenever wishlist items change
        effect(() => {
            this.saveToStorage();
        });
    }

    toggleWishlist(product: any) {
        this._wishlistItems.update(items => {
            const exists = items.find(i => i.id === product.id);
            if (exists) {
                return items.filter(i => i.id !== product.id);
            }
            return [...items, {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.image || product.image1,
                category: product.category,
                inStock: product.stock !== 0 // Small stock check logic
            }];
        });
    }

    isInWishlist(productId: number) {
        return computed(() => !!this._wishlistItems().find(i => i.id === productId))();
    }

    // Senior Move: UX Killer Feature
    moveToBag(product: WishlistItem) {
        if (!product.inStock && product.inStock !== undefined) return;

        // 1. Add to Bag
        this.cartService.addToCart(product);

        // 2. Remove from Wishlist
        this.removeFromWishlist(product.id);

        // 3. Optional: Cart Drawer opens automatically via CartService.addToCart logic
    }

    removeFromWishlist(productId: number) {
        this._wishlistItems.update(items => items.filter(i => i.id !== productId));
    }

    private saveToStorage() {
        localStorage.setItem('moda_house_wishlist', JSON.stringify(this._wishlistItems()));
    }

    private loadFromStorage() {
        const saved = localStorage.getItem('moda_house_wishlist');
        if (saved) {
            try {
                this._wishlistItems.set(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading wishlist from storage', e);
            }
        }
    }
}
