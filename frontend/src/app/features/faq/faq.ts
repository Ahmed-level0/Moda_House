<<<<<<< HEAD
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
=======
import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

@Component({
    selector: 'app-faq',
    standalone: true,
<<<<<<< HEAD
    imports: [CommonModule],
=======
    imports: [CommonModule, RouterLink],
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
    template: `
    <div class="faq-page">
        <div class="container narrow">
            <header class="faq-header">
<<<<<<< HEAD
                <h1>Frequently Asked Questions</h1>
                <p>Finding answers to your common inquiries</p>
            </header>

            <div class="faq-sections">
                @for (section of faqs; track section.title) {
=======
                <h1>{{ t('faq.title') }}</h1>
                <p>{{ t('faq.subtitle') }}</p>
            </header>

            <div class="faq-sections">
                @for (section of faqs(); track section.title) {
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
                    <div class="faq-category">
                        <h2>{{ section.title }}</h2>
                        <div class="accordion">
                            @for (item of section.items; track item.q) {
                                <div class="accordion-item" [class.active]="activeQuestion() === item.q">
                                    <button class="accordion-trigger" (click)="toggle(item.q)">
                                        <span>{{ item.q }}</span>
                                        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                    <div class="accordion-content">
                                        <p>{{ item.a }}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
            
            <div class="faq-footer">
<<<<<<< HEAD
                <p>Have more questions?</p>
                <a href="/contact" class="btn-outline">Contact Support</a>
=======
                <p>{{ t('faq.footer_q') }}</p>
                <a routerLink="/contact" class="btn-outline">{{ t('faq.contact_btn') }}</a>
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
            </div>
        </div>
    </div>
  `,
    styles: [`
    .faq-page { padding: 100px 0; background: #fff; }
    .container.narrow { max-width: 850px; margin: 0 auto; }
    .faq-header { 
        text-align: center; 
        margin-bottom: 80px;
        h1 { font-family: 'Playfair Display', serif; font-size: 3.5rem; margin-bottom: 15px; }
        p { color: #999; font-size: 1.1rem; }
    }
    .faq-category {
        margin-bottom: 60px;
        h2 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 25px; }
    }
    .accordion-item {
        border-bottom: 1px solid #f0f0f0;
        &:first-child { border-top: 1px solid #f0f0f0; }
        
        .accordion-trigger {
            width: 100%;
            padding: 25px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: none;
            border: none;
            cursor: pointer;
            text-align: left;
            font-size: 1.1rem;
            font-weight: 600;
            color: #222;
            transition: color 0.3s;
            
            &:hover { color: #d4af37; }
<<<<<<< HEAD
=======
            [dir="rtl"] & { text-align: right; }
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
            .chevron { width: 18px; height: 18px; transition: transform 0.3s; color: #ccc; }
        }

        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            p { padding-bottom: 25px; color: #666; line-height: 1.6; margin: 0; font-size: 1rem; }
        }

        &.active {
            .accordion-trigger { color: #d4af37; .chevron { transform: rotate(180deg); color: #d4af37; } }
<<<<<<< HEAD
            .accordion-content { max-height: 200px; }
=======
            .accordion-content { max-height: 400px; }
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
        }
    }
    .faq-footer {
        margin-top: 100px;
        text-align: center;
        padding: 60px;
        background: #fafafa;
        border-radius: 12px;
        p { font-size: 1.2rem; margin-bottom: 20px; color: #444; }
        .btn-outline { 
            display: inline-block; 
            padding: 15px 35px; 
            border: 1px solid #000; 
            color: #000; 
            text-decoration: none; 
            font-weight: 700; 
            text-transform: uppercase; 
            letter-spacing: 2px;
            transition: all 0.3s;
            &:hover { background: #000; color: #fff; }
        }
    }
  `]
})
export class FAQComponent {
<<<<<<< HEAD
    activeQuestion = signal<string | null>(null);

    faqs = [
        {
            title: 'Products & Collections',
            items: [
                { q: 'Are your items authentic?', a: 'Every item at Moda House is guaranteed to be 100% authentic. We source directly from authorized distributors and artisans.' },
                { q: 'Can I request a custom perfume?', a: 'Currently, we do not offer custom blending services, but we do curate limited edition collections periodically.' }
            ]
        },
        {
            title: 'Orders & Payments',
            items: [
                { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Instapay, and all major Credit/Debit cards.' },
                { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 hours of placement. Please contact our support team immediately for assistance.' }
            ]
        }
    ];
=======
    private translationService = inject(TranslationService);
    activeQuestion = signal<string | null>(null);

    t(key: string) {
        return this.translationService.translate(key);
    }

    faqs = computed(() => [
        {
            title: this.t('faq.section1_title'),
            items: [
                { q: this.t('faq.q1'), a: this.t('faq.a1') },
                { q: this.t('faq.q2'), a: this.t('faq.a2') }
            ]
        },
        {
            title: this.t('faq.section2_title'),
            items: [
                { q: this.t('faq.q3'), a: this.t('faq.a3') },
                { q: this.t('faq.q4'), a: this.t('faq.a4') }
            ]
        }
    ]);
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

    toggle(q: string) {
        this.activeQuestion.update(v => v === q ? null : q);
    }
}
