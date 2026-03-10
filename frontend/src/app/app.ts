import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { CartDrawer } from './shared/components/cart-drawer/cart-drawer';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, CartDrawer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private http = inject(HttpClient);
  private translationService = inject(TranslationService);
  protected readonly title = signal('moda-house-frontend');

  constructor() {
    this.http.get('/assets/i18n/en.json').subscribe(data => {
      this.translationService.setTranslations('en', data);
    });
    this.http.get('/assets/i18n/ar.json').subscribe(data => {
      this.translationService.setTranslations('ar', data);
    });
  }
}
