import { Component, inject, signal, OnInit, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Import Location
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProductService, Product } from '../../../core/services/product.service';
<<<<<<< HEAD
=======
import { TranslationService } from '../../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
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

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);

  isInWishlist = computed(() => {
    const p = this.product();
    return p ? this.wishlistService.isInWishlist(p.id) : false;
  });

  toggleWishlist() {
    const p = this.product();
    if (p) this.wishlistService.toggleWishlist(p);
  }

  // UI State
  selectedImage = signal<string>('');
  selectedSize = signal<string>('');
  selectedColor = signal<string>(''); // Hex
  quantity = signal<number>(1);

  // Micro-interactions State
  errorMessage = signal<string>('');
  isZoomOpen = signal<boolean>(false);


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loadProduct(id);
      window.scrollTo(0, 0);
    });
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (found) => {
        this.product.set(found);

        // Reset State
        this.selectedImage.set(found.images?.[0]?.image || '');
        this.selectedSize.set('');
        this.selectedColor.set('');

        // Auto-select if only one option exists
        // (Note: Backend might not have sizes/colors yet in the specific model shown)

        this.quantity.set(1);
        this.errorMessage.set('');

        // For demo, we'll still use some mock related products if backend doesn't provide them
        this.productService.getProducts().subscribe(all => {
          this.relatedProducts.set(all.filter(p => p.id !== found.id).slice(0, 4));
        });
      },
      error: (err) => {
        console.error('Product not found', err);
        this.errorMessage.set('Product not found');
      }
    });
  }

  setImage(img: any) {
    this.selectedImage.set(typeof img === 'string' ? img : img.image);
  }

  setSize(size: string) {
    this.selectedSize.set(size);
    this.errorMessage.set('');
  }

  setColor(hex: string) {
    this.selectedColor.set(hex);
    this.errorMessage.set('');
  }

  incrementQty() {
    this.quantity.update(q => q + 1);
  }

  decrementQty() {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  addToBag() {
    const p = this.product();
    if (!p || p.stock <= 0) return;

    // Smart Validation
    if (p.sizes?.length && !this.selectedSize()) {
<<<<<<< HEAD
      this.errorMessage.set('Please select a size');
=======
      this.errorMessage.set(this.t('product_details.alert_select_size'));
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
      setTimeout(() => this.errorMessage.set(''), 3000); // Clear after 3 seconds
      return;
    }
    if (p.colors?.length && !this.selectedColor()) {
<<<<<<< HEAD
      this.errorMessage.set('Please select a color');
=======
      this.errorMessage.set(this.t('product_details.alert_select_color'));
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
      setTimeout(() => this.errorMessage.set(''), 3000); // Clear after 3 seconds
      return;
    }

    // Success
    this.cartService.addToCart({
      ...p,
      image: p.images?.[0]?.image || '',
      quantity: this.quantity()
    });
    this.errorMessage.set(''); // Clear any previous error message
  }

  goBack() {
    this.location.back();
  }

  @ViewChild('relatedScroll') relatedScroll!: ElementRef;

  scrollRelated(direction: 'left' | 'right') {
    const container = this.relatedScroll?.nativeElement;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  openZoom() {
    this.isZoomOpen.set(true);
  }

  closeZoom() {
    this.isZoomOpen.set(false);
  }
}
