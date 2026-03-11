<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
=======
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

@Component({
    selector: 'app-refund-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="policy-page">
        <div class="container narrow">
            <header class="policy-header">
<<<<<<< HEAD
                <h1>Returns & Exchanges</h1>
                <p>Ensuring your absolute satisfaction</p>
            </header>

            <section class="policy-section">
                <h2>14-Day Return Guarantee</h2>
                <p>We take immense pride in the quality of our products. If you are not entirely satisfied with your purchase, you may return the item(s) within 14 days of receipt for a full refund or exchange.</p>
            </section>

            <section class="policy-section">
                <h2>Return Conditions</h2>
                <p>To be eligible for a return, your item must be:</p>
                <ul>
                    <li>In its original, unused condition (unworn, unwashed).</li>
                    <li>In the original premium packaging with all tags attached.</li>
                    <li>Accompanied by the original invoice or proof of purchase.</li>
                </ul>
                <div class="alert-box">
                    <p><strong>Note:</strong> Specialized items such as opened perfumes and bespoke accessories cannot be returned due to hygiene and customization reasons.</p>
=======
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
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
                </div>
            </section>

            <section class="policy-section">
<<<<<<< HEAD
                <h2>How to Initiate a Return</h2>
                <ol>
                    <li>Contact our concierge team at <a href="mailto:returns@modahouse.com">returns@modahouse.com</a> with your order number.</li>
                    <li>Securely package the item in its original box.</li>
                    <li>Our courier will collect the package from your doorstep within 48 hours.</li>
=======
                <h2>{{ t('policies.refund.initiate_title') }}</h2>
                <ol>
                    <li>{{ t('policies.refund.step1') }}</li>
                    <li>{{ t('policies.refund.step2') }}</li>
                    <li>{{ t('policies.refund.step3') }}</li>
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
                </ol>
            </section>

            <section class="policy-section">
<<<<<<< HEAD
                <h2>Refund Process</h2>
                <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed via your original payment method within 5-7 business days.</p>
=======
                <h2>{{ t('policies.refund.process_title') }}</h2>
                <p>{{ t('policies.refund.process_desc') }}</p>
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
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
<<<<<<< HEAD
export class RefundPolicyComponent { }
=======
export class RefundPolicyComponent {
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }
}
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
