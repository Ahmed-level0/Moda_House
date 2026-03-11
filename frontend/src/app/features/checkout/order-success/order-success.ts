import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslationService } from '../../../core/services/translation.service';
@Component({
    selector: 'app-order-success',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './order-success.html',
    styleUrl: './order-success.scss'
})
export class OrderSuccessComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }    orderNumber = signal('');
    deliveryDate = signal('');

    ngOnInit() {
        const id = this.route.snapshot.queryParamMap.get('id');
        if (id) {
            this.orderNumber.set(id);
        } else {
            this.orderNumber.set('MH-' + Math.random().toString(36).substr(2, 9).toUpperCase());
        }

        // Set delivery date to 3 days from now
        const date = new Date();
        date.setDate(date.getDate() + 3);
        this.deliveryDate.set(date.toLocaleDateString(this.translationService.currentLang() === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        this.triggerConfetti();
    }

    triggerConfetti() {
        console.log('Confetti triggered!');
    }
}
