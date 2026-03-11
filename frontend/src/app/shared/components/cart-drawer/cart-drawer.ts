import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
    selector: 'app-cart-drawer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart-drawer.html',
    styleUrl: './cart-drawer.scss'
})
export class CartDrawer {
    cartService = inject(CartService);
    private translationService = inject(TranslationService);

    t(key: string) {
        return this.translationService.translate(key);
    }

    // Expose signals to template
    cartItems = this.cartService.cartItems;
    isDrawerOpen = this.cartService.isDrawerOpen;
    subtotal = this.cartService.subtotal;

    close() {
        this.cartService.toggleDrawer(false);
    }

    updateQty(productId: number, delta: number) {
        this.cartService.updateQuantity(productId, delta);
    }

    removeItem(productId: number) {
        this.cartService.removeFromCart(productId);
    }
}
