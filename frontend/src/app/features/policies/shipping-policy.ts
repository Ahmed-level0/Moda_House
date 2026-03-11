import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
@Component({
    selector: 'app-shipping-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="policy-page">
        <div class="container narrow">
            <header class="policy-header">
                <h1>{{ t('policies.shipping.title') }}</h1>
                <p>{{ t('policies.shipping.last_updated') }}</p>
            </header>

            <section class="policy-section">
                <h2>{{ t('policies.shipping.domestic_title') }}</h2>
                <p>{{ t('policies.shipping.domestic_desc') }}</p>
                <div class="shipping-grid">
                    <div class="ship-card">
                        <h3>{{ t('policies.shipping.cairo_giza') }}</h3>
                        <p class="time">{{ t('policies.shipping.days_1_2') }}</p>
                        <p class="cost">{{ t('policies.shipping.cost_50') }}</p>
                    </div>
                    <div class="ship-card">
                        <h3>{{ t('policies.shipping.alexandria') }}</h3>
                        <p class="time">{{ t('policies.shipping.days_2_3') }}</p>
                        <p class="cost">{{ t('policies.shipping.cost_65') }}</p>
                    </div>
                    <div class="ship-card">
                        <h3>{{ t('policies.shipping.other_gov') }}</h3>
                        <p class="time">{{ t('policies.shipping.days_3_5') }}</p>
                        <p class="cost">{{ t('policies.shipping.cost_80') }}</p>                    </div>
                </div>
            </section>

            <section class="policy-section">
                <h2>{{ t('policies.shipping.tracking_title') }}</h2>
                <p>{{ t('policies.shipping.tracking_desc') }}</p>
            </section>

            <section class="policy-section">
                <h2>{{ t('policies.shipping.intl_title') }}</h2>
                <p>{{ t('policies.shipping.intl_desc') }}</p>            </section>
        </div>
    </div>
  `,
    styles: [`
    .policy-page { padding: 100px 0; background: #fff; }
    .container.narrow { max-width: 800px; margin: 0 auto; }
    .policy-header { 
        text-align: center; 
        margin-bottom: 60px;
        h1 { font-family: 'Playfair Display', serif; font-size: 3.5rem; margin-bottom: 15px; }
        p { color: #999; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
    }
    .policy-section {
        margin-bottom: 50px;
        h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        p { line-height: 1.8; color: #555; margin-bottom: 20px; }
        a { color: #000; font-weight: 700; text-decoration: underline; }
    }
    .shipping-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 30px;
        @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .ship-card {
        padding: 25px;
        background: #fafafa;
        border-radius: 8px;
        text-align: center;
        h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; color: #888; }
        .time { font-weight: 700; font-size: 1.1rem; margin-bottom: 5px; color: #000; }
        .cost { color: #d4af37; font-weight: 800; }
    }
  `]
})
export class ShippingPolicyComponent {
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }
}