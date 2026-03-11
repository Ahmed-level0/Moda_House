
import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductService, Product } from '../../../core/services/product.service';
<<<<<<< HEAD
=======
import { TranslationService } from '../../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818


@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
    private route = inject(ActivatedRoute);
    private cartService = inject(CartService);
    private wishlistService = inject(WishlistService);
    private productService = inject(ProductService);
<<<<<<< HEAD
=======
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

    addToBag(product: any, event?: Event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.cartService.addToCart({
            ...product,
            image: product.images?.[0]?.image || ''
        });
    }

    toggleWishlist(product: Product, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.wishlistService.toggleWishlist(product);
    }

    isInWishlist(id: number) {
        return this.wishlistService.isInWishlist(id);
    }

    // Available Filter Options
    availableStyles = ['casual', 'elegant', 'feminine', 'men', 'luxury', 'vintage'];
    availableColors = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Red', hex: '#E63946' },
        { name: 'Blue', hex: '#1D3557' },
        { name: 'Gold', hex: '#D4AF37' },
        { name: 'Green', hex: '#2A9D8F' }
    ];

    // Mock Data containing Styles & Colors
    products = signal<any[]>([]);

    filtersOpen = signal(false);

    // Active Filters
    activeCategory = signal<string>('all');
    activeStyle = signal<string>('all');
    activeColor = signal<string>('all'); // Hex code or 'all'
    sortBy = signal<string>('newest');
    isDiscounted = signal<boolean>(false);

    // Category ID mapping
    categoryMapping: Record<string, number> = {
        'bags': 1,
        'scarfs': 2,
        'perfumes': 3,
        'accessories': 4
    };

    // Computed filtered products
    filteredProducts = computed(() => {
        let list = this.products();

        // 3. Sorting
        const sort = this.sortBy();
        if (sort === 'price-low') {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            list = [...list].sort((a, b) => b.price - a.price);
        }

        return list;
    });

    constructor() {
        this.route.url.subscribe(url => {
            const isSale = url.some(segment => segment.path === 'on-sale');
            this.isDiscounted.set(isSale);
        });

        this.route.paramMap.subscribe(params => {
            const cat = params.get('category');
            const style = params.get('style');

            if (cat) {
                this.activeCategory.set(cat);
                this.activeStyle.set('all'); // Clear style when changing category
                this.activeColor.set('all'); // Clear color when changing category
            } else if (style) {
                this.activeStyle.set(style);
                this.activeCategory.set('all');
                this.activeColor.set('all');
            } else {
                this.activeCategory.set('all');
                // Check if we are on 'on-sale' route which doesn't have params
                const isSale = this.isDiscounted();
                if (!isSale) {
                    this.activeStyle.set('all');
                    this.activeColor.set('all');
                }
            }
            this.loadProducts();
        });
    }

    loadProducts() {
        const catName = this.activeCategory();
        const catId = catName !== 'all' ? this.categoryMapping[catName.toLowerCase()] : undefined;
        const discounted = this.isDiscounted();
        const colorHex = this.activeColor();
        const colorName = colorHex !== 'all' ? this.availableColors.find(c => c.hex === colorHex)?.name : undefined;
        const style = this.activeStyle() !== 'all' ? this.activeStyle() : undefined;

        this.productService.getProducts(catId, discounted, colorName, style).subscribe(data => {
            const mappedData = data.map(p => ({
                ...p,
                image1: p.images?.[0]?.image || '',
                image2: p.images?.[1]?.image || p.images?.[0]?.image || ''
            }));
            this.products.set(mappedData);
        });
    }

    toggleFilters() {
        this.filtersOpen.update(v => !v);
    }

    setCategory(cat: string) {
        this.activeCategory.set(cat);
        this.loadProducts();
    }

    setStyle(style: string) {
        // Toggle logic or simple set? Simple set for clear filtering behavior.
        if (this.activeStyle() === style) {
            this.activeStyle.set('all');
        } else {
            this.activeStyle.set(style);
        }
        this.loadProducts();
    }

    setColor(hex: string) {
        if (this.activeColor() === hex) {
            this.activeColor.set('all');
        } else {
            this.activeColor.set(hex);
        }
        this.loadProducts();
    }

    setSort(sort: string) {
        this.sortBy.set(sort);
    }

    // Quick View Modal
    quickViewProduct = signal<Product | null>(null);

    openQuickView(product: Product, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.quickViewProduct.set(product);
    }

    closeQuickView() {
        this.quickViewProduct.set(null);
    }
}
