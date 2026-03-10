import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
    selector: 'app-refund-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="policy-page">
        <div class="container narrow">
            <header class="policy-header">
                <h1>{{ t('policies.refund.title') }}</h1>
                <p>{{ t('policies.refund.subtitle') }}</p>
            </header>

            <section class="policy-section">
                <h2>{{ t('policies.refund.guarantee_title') }}</h2>
                <p>{{ t('policies.refund.guarantee_desc') }}</p>
            </section>

            <section class="policy-section">
                <h2>{{ t('policies.refund.conditions_title') }}</h2>
                <p>{{ t('policies.refund.conditions_intro') }}</p>
                <ul>
                    <li>{{ t('policies.refund.cond1') }}</li>
                    <li>{{ t('policies.refund.cond2') }}</li>
                    <li>{{ t('policies.refund.cond3') }}</li>
                </ul>
                <div class="alert-box">
                    <p><strong>{{ t('policies.refund.note_title') }}</strong> {{ t('policies.refund.note_desc') }}</p>
                </div>
            </section>

            <section class="policy-section">
                <h2>{{ t('policies.refund.initiate_title') }}</h2>
                <ol>
                    <li>{{ t('policies.refund.step1') }}</li>
                    <li>{{ t('policies.refund.step2') }}</li>
                    <li>{{ t('policies.refund.step3') }}</li>
                </ol>
            </section>

            <section class="policy-section">
                <h2>{{ t('policies.refund.process_title') }}</h2>
                <p>{{ t('policies.refund.process_desc') }}</p>
            </section>
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
        p, li { line-height: 1.8; color: #555; margin-bottom: 15px; }
        ul, ol { padding-left: 20px; }
        a { color: #000; font-weight: 700; text-decoration: underline; }
    }
    .alert-box {
        padding: 20px;
        background: #fff9f9;
        border-left: 4px solid #e63946;
        margin-top: 20px;
        p { margin: 0; color: #721c24; font-size: 0.95rem; }
    }
  `]
})
export class RefundPolicyComponent {
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }
}
