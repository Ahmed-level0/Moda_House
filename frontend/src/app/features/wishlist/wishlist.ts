import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem } from '../../core/services/wishlist.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './wishlist.html',
    styleUrl: './wishlist.scss'
})
export class WishlistComponent {
    wishlistService = inject(WishlistService);
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }

    wishlistItems = this.wishlistService.wishlistItems;
    totalCount = this.wishlistService.totalCount;

    removeItem(id: number) {
        this.wishlistService.removeFromWishlist(id);
    }

    moveToBag(item: WishlistItem) {
        this.wishlistService.moveToBag(item);
    }
}
