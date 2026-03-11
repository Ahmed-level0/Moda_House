<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
=======
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about.html',
    styleUrl: './about.scss'
})
<<<<<<< HEAD
export class AboutComponent { }
=======
export class AboutComponent {
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }
}
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818
