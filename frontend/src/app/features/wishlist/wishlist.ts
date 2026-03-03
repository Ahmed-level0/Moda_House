import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../core/services/wishlist.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './wishlist.html',
    styleUrl: './wishlist.scss'
})
export class WishlistComponent {
    wishlistService = inject(WishlistService);

    wishlistItems = this.wishlistService.wishlistItems;
    totalCount = this.wishlistService.totalCount;

    removeItem(id: number) {
        this.wishlistService.removeFromWishlist(id);
    }

    moveToBag(item: WishlistItem) {
        this.wishlistService.moveToBag(item);
    }
}
