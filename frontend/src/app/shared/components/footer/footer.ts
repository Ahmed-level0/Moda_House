import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected translationService = inject(TranslationService);
  currentLang = this.translationService.currentLang;

  t(key: string) {
    return this.translationService.translate(key);
  }
  onSubscribe(event: Event) {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).querySelector('input')?.value;
    if (email) {
      alert(`Thank you for subscribing, ${email}!`);
      (event.target as HTMLFormElement).reset();
    }
  }
}
