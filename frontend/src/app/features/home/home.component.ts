import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ProductService, Product } from '../../core/services/product.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    private productService = inject(ProductService);
    private sanitizer = inject(DomSanitizer);
    private translationService = inject(TranslationService);
    currentLang = this.translationService.currentLang;

    t(key: string) {
        return this.translationService.translate(key);
    }

    categoryMapping: Record<string, number> = {
        'bags': 1,
        'scarfs': 2,
        'perfumes': 3,
        'accessories': 4
    };

    styles: any[] = [
        {
            name: 'Casual',
            class: 'style-casual',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L3 9V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V9L12 2Z" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            name: 'Elegant',
            class: 'style-elegant',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            name: 'Feminine',
            class: 'style-feminine',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8V16" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12H16" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            name: 'Men Essentials',
            class: 'style-men',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7H4C3.44772 7 3 7.44772 3 8V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V8C21 7.44772 20.5523 7 20 7Z" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            name: 'Luxury Picks',
            class: 'style-luxury',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            name: 'Vintage Classic',
            class: 'style-vintage',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8V12L15 15" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2V4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V22" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 12H22" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12H4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        }
    ];

    specialOffers: Product[] = [];
    trendyProducts: Product[] = [];
    highlightPerfume: Product | null = null;

    currentTrendyIndex = 0;
    currentOffersIndex = 0;
    itemsPerSlide = 4;

    ngOnInit() {
        this.styles = this.styles.map(style => ({
            ...style,
            safeSvg: this.sanitizer.bypassSecurityTrustHtml(style.svg)
        }));
        this.calculateItemsPerSlide();
        this.loadProducts();
    }

    private loadProducts() {
        // Load Trendy Products (All products for now, or could be a specific category)
        this.productService.getProducts().subscribe(products => {
            this.trendyProducts = products.slice(0, 12); // Show top 12
        });

        // Load Special Offers (Discounted products)
        this.productService.getDiscountedProducts().subscribe(products => {
            this.specialOffers = products;
        });

        // Load Highlight Perfume (Category 3)
        this.productService.getProducts(3).subscribe(products => {
            if (products.length > 0) {
                this.highlightPerfume = products[0];
            }
        });
    }

    @HostListener('window:resize')
    onResize() {
        this.calculateItemsPerSlide();
    }

    private calculateItemsPerSlide() {
        if (window.innerWidth <= 600) {
            this.itemsPerSlide = 1;
        } else if (window.innerWidth <= 1200) {
            this.itemsPerSlide = 2;
        } else {
            this.itemsPerSlide = 4;
        }

        // Reset indexes if out of bounds after resize
        if (this.currentTrendyIndex > this.maxTrendyIndex) {
            this.currentTrendyIndex = this.maxTrendyIndex;
        }
        if (this.currentOffersIndex > this.maxOffersIndex) {
            this.currentOffersIndex = this.maxOffersIndex;
        }
    }

    // Trendy Carousel Logic
    get maxTrendyIndex() {
        return Math.max(0, Math.ceil(this.trendyProducts.length / this.itemsPerSlide) - 1);
    }

    nextTrendy() {
        if (this.currentTrendyIndex < this.maxTrendyIndex) {
            this.currentTrendyIndex++;
        } else {
            this.currentTrendyIndex = 0;
        }
    }

    prevTrendy() {
        if (this.currentTrendyIndex > 0) {
            this.currentTrendyIndex--;
        } else {
            this.currentTrendyIndex = this.maxTrendyIndex;
        }
    }

    setTrendy(index: number) {
        this.currentTrendyIndex = index;
    }

    // Offers Carousel Logic
    get maxOffersIndex() {
        return Math.max(0, Math.ceil(this.specialOffers.length / this.itemsPerSlide) - 1);
    }

    nextOffers() {
        if (this.currentOffersIndex < this.maxOffersIndex) {
            this.currentOffersIndex++;
        } else {
            this.currentOffersIndex = 0;
        }
    }

    prevOffers() {
        if (this.currentOffersIndex > 0) {
            this.currentOffersIndex--;
        } else {
            this.currentOffersIndex = this.maxOffersIndex;
        }
    }

    setOffers(index: number) {
        this.currentOffersIndex = index;
    }
}
