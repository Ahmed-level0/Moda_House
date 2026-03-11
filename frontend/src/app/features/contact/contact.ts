import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
<<<<<<< HEAD
=======
import { TranslationService } from '../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contact.html',
    styleUrl: './contact.scss'
})
export class ContactComponent {
    private http = inject(HttpClient);
<<<<<<< HEAD
    isSubmitted = signal(false);
    isLoading = signal(false);

=======
    private translationService = inject(TranslationService);
    currentLang = this.translationService.currentLang;
    isSubmitted = signal(false);
    isLoading = signal(false);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }

>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
    onSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        // Extracting values manually since HTML modification is restricted
        const nameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        const subjectSelect = form.querySelector('select') as HTMLSelectElement;
        const messageTextarea = form.querySelector('textarea') as HTMLTextAreaElement;

        const payload = {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectSelect.value,
            message: messageTextarea.value
        };

        this.isLoading.set(true);

        this.http.post(`${environment.apiUrl}/api/contact/`, payload)
            .subscribe({
                next: () => {
                    this.isSubmitted.set(true);
                    this.isLoading.set(false);
                    // Reset after some time
                    setTimeout(() => {
                        this.isSubmitted.set(false);
                    }, 5000);
                },
                error: (err) => {
                    console.error('Contact error:', err);
                    this.isLoading.set(false);
<<<<<<< HEAD
                    alert('There was an error sending your message. Please try again later.');
=======
                    alert(this.t('contact.error'));
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
                }
            });
    }
}
