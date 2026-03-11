import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private platformId = inject(PLATFORM_ID);

    // Current language signal
    currentLang = signal<'ar' | 'en'>('en');

    // Translations data
    private translations = signal<any>({
        en: {},
        ar: {}
    });

    constructor() {
        this.loadLang();

        // Effect to handle Side effects of language change
        effect(() => {
            const lang = this.currentLang();
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('lang', lang);
                document.documentElement.lang = lang;
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            }
        });
    }

    setTranslations(lang: 'ar' | 'en', data: any) {
        this.translations.update(t => ({ ...t, [lang]: data }));
    }

    translate(key: string, params: any = {}): string {
        const keys = key.split('.');
        let value = this.translations()[this.currentLang()];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Return key if not found
            }
        }

        if (typeof value === 'string') {
            Object.keys(params).forEach(param => {
                value = (value as string).replace(`{{${param}}}`, params[param]);
            });
        }

        return value;
    }

    toggleLang() {
        this.currentLang.update(lang => lang === 'en' ? 'ar' : 'en');
    }

    private loadLang() {
        if (isPlatformBrowser(this.platformId)) {
            const saved = localStorage.getItem('lang') as 'ar' | 'en';
            if (saved) {
                this.currentLang.set(saved);
            }
        }
    }
}
