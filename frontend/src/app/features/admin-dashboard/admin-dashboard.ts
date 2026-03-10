import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview';
import { ManageProductsComponent } from './manage-products/manage-products';
import { ManageUsersComponent } from './manage-users/manage-users';
import { AnalyticsComponent } from './analytics/analytics';
import { ManageCategoriesComponent } from './manage-categories/manage-categories';
import { ManageOrdersComponent } from './manage-orders/manage-orders';
import { SettingsComponent } from './settings/settings';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        DashboardOverviewComponent,
        ManageProductsComponent,
        ManageUsersComponent,
        AnalyticsComponent,
        ManageCategoriesComponent,
        ManageOrdersComponent,
        SettingsComponent
    ],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    public translationService = inject(TranslationService);

    t = this.translationService.translate.bind(this.translationService);

    activeTab = signal<'dashboard' | 'products' | 'orders' | 'customers' | 'categories' | 'analytics' | 'settings'>('dashboard');
    adminName = signal(this.authService.user()?.username || 'Admin');

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
