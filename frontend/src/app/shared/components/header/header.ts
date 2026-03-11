import { Component, signal, HostListener, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  protected translationService = inject(TranslationService);

  cartCount = this.cartService.totalCount;
  wishlistCount = this.wishlistService.totalCount;
  isLoggedIn = this.authService.isLoggedIn;
  user = this.authService.user;
  currentLang = this.translationService.currentLang;

  toggleLang() {
    this.translationService.toggleLang();
  }

  t(key: string, params: any = {}) {
    return this.translationService.translate(key, params);
  }

  isSearchOpen = signal(false);
  isMenuOpen = signal(false);
  activeCategory = signal('womenswear');
  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleSearch(state: boolean) {
    this.isSearchOpen.set(state);
  }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  toggleMenu(state: boolean) {
    this.isMenuOpen.set(state);
  }

  openCart() {
    this.cartService.toggleDrawer(true);
  }

  @ViewChild('trendingScroll') trendingScroll!: ElementRef;

  scrollTrending(direction: 'left' | 'right') {
    const container = this.trendingScroll?.nativeElement;
    if (container) {
      const scrollAmount = 250; // Approximated card width + gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  trendingProducts = signal([
    {
      id: 1,
      name: 'Signature Leather Tote',
      brand: 'Gucci',
      price: 2450,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300'
    },
    {
      id: 2,
      name: 'Elysian Bloom Perfume',
      brand: 'Chanel',
      price: 195,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=300'
    },
    {
      id: 4,
      name: 'Gold Chain Bracelet',
      brand: 'Cartier',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1611085583191-a3b1a308c021?q=80&w=300'
    },
    {
      id: 8,
      name: 'Monogram Canvas Totebag',
      brand: 'Louis Vuitton',
      price: 3100,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=300'
    },
    {
      id: 6,
      name: 'Oud Wood Intense',
      brand: 'Tom Ford',
      price: 280,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=300'
    }
  ]);
}
