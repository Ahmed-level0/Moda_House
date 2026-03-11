<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
=======
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

@Component({
    selector: 'app-order-cancellation-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="policy-page">
        <div class="container narrow">
            <header class="policy-header">
<<<<<<< HEAD
                <h1>Order Cancellation Policy</h1>
                <p>Simple and transparent process</p>
            </header>

            <section class="policy-section">
                <h2>How to Cancel Your Order</h2>
                <p>We understand that plans can change. To cancel your order, please follow these steps:</p>
                <ol>
                    <li>Contact us through our official channels:
                        <ul>
                            <li><strong>WhatsApp:</strong> Send a message to our store number.</li>
                            <li><strong>Instagram:</strong> Send a DM to our store page.</li>
                        </ul>
                    </li>
                    <li>Provide your <strong>order details</strong> (Order ID and Email).</li>
                    <li>Wait for our staff to reply. We typically respond within <strong>2 - 3 business days</strong>.</li>
                    <li>Provide the <strong>mobile number</strong> or <strong>Visa card</strong> details you wish to receive your cashback on.</li>
=======
                <h1>{{ t('policies.cancellation.title') }}</h1>
                <p>{{ t('policies.cancellation.subtitle') }}</p>
            </header>

            <section class="policy-section">
                <h2>{{ t('policies.cancellation.how_to_title') }}</h2>
                <p>{{ t('policies.cancellation.how_to_desc') }}</p>
                <ol>
                    <li>{{ t('policies.cancellation.step1_title') }}
                        <ul>
                            <li><strong>{{ t('policies.cancellation.whatsapp') }}</strong></li>
                            <li><strong>{{ t('policies.cancellation.instagram') }}</strong></li>
                        </ul>
                    </li>
                    <li>{{ t('policies.cancellation.step2') }}</li>
                    <li>{{ t('policies.cancellation.step3') }}</li>
                    <li>{{ t('policies.cancellation.step4') }}</li>
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
                </ol>
            </section>

            <section class="policy-section">
<<<<<<< HEAD
                <h2>Confirmation</h2>
                <p>Once your order has been successfully cancelled, you will receive a <strong>confirmation email</strong> naturally updating you on the status.</p>
            </section>

            <div class="alert-box">
                <p><strong>Note:</strong> Orders that have already been shipped or are in the final stages of processing may not be eligible for cancellation. In such cases, please refer to our <a href="/refund-policy">Refund Policy</a>.</p>
=======
                <h2>{{ t('policies.cancellation.confirmation_title') }}</h2>
                <p>{{ t('policies.cancellation.confirmation_desc') }}</p>
            </section>

            <div class="alert-box">
                <p><strong>{{ t('policies.cancellation.note_title') }}</strong> {{ t('policies.cancellation.note_desc') }}</p>
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
            </div>
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
        li strong { color: #000; }
        a { color: #000; font-weight: 700; text-decoration: underline; }
    }
    .alert-box {
        padding: 20px;
        background: #fdfdfd;
        border-left: 4px solid var(--secondary, #c5a059);
        margin-top: 20px;
        p { margin: 0; color: #555; font-size: 0.95rem; }
    }
  `]
})
<<<<<<< HEAD
export class OrderCancellationPolicyComponent { }
=======
export class OrderCancellationPolicyComponent {
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }
}
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
