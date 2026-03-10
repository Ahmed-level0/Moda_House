import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { environment } from '../../../environments/environment';
import { TranslationService } from '../../core/services/translation.service';

@Component({
    selector: 'app-track-order',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './track-order.html',
    styleUrl: './track-order.scss'
})
export class TrackOrderComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private orderService = inject(OrderService);
    private translationService = inject(TranslationService);

    t(key: string, params: any = {}) {
        return this.translationService.translate(key, params);
    }

    orderIdInput = signal('');
    trackingData = signal<any>(null);
    isLoading = signal(false);

    // Editing State
    isEditing = signal(false);
    editableData = signal<any>(null);
    isUpdating = signal(false);

    ngOnInit() {
        // Check if Order ID is passed in URL
        this.route.queryParamMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.orderIdInput.set(id);
                this.trackOrder();
            }
        });
    }

    onInputChange(event: Event) {
        this.orderIdInput.set((event.target as HTMLInputElement).value);
    }

    trackOrder() {
        const id = this.orderIdInput().trim();
        if (!id) {
            this.trackingData.set(null);
            return;
        }

        this.isLoading.set(true);
        this.orderService.getOrder(id).subscribe({
            next: (order) => {
                console.log('Track Order Data Received:', order);

                if (!order) {
                    this.trackingData.set(null);
                    this.isLoading.set(false);
                    return;
                }

                // Map backend status to frontend timeline
                let uiStatus = 'placed';
                const status = (order.status || 'Pending').toLowerCase();

                if (status === 'pending') uiStatus = 'placed';
                else if (status === 'paid' || status === 'cod') uiStatus = 'confirmed';
                else if (status === 'processing') uiStatus = 'packing';
                else if (status === 'shipped') uiStatus = 'shipped';
                else if (status === 'delivered') uiStatus = 'delivered';
                else if (status === 'cancelled') uiStatus = 'cancelled';

                this.trackingData.set({
                    id: order.id,
                    date: order.created_at ? new Date(order.created_at).toLocaleDateString(this.translationService.currentLang() === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : this.t('track_order.unknown_date'),
                    status: uiStatus,
                    address: order.address || 'Address not available',
                    phone: order.phone || '',
                    itemsCount: order.items?.length || 0,
                    items: (order.items || []).map((item: any) => ({
                        product: item.product,
                        name: item.product_name || `Product #${item.product}`,
                        qty: item.quantity,
                        price: item.product_price,
                        image: this.formatImageUrl(item.product_image)
                    }))
                });
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Tracking failed', err);
                this.trackingData.set(null);
                this.isLoading.set(false);
            }
        });
    }

    private formatImageUrl(url: string): string {
        if (!url) return 'https://via.placeholder.com/150';
        if (url.startsWith('http')) return url;
        const baseUrl = environment.apiUrl;
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    toggleEdit() {
        if (this.isEditing()) {
            this.isEditing.set(false);
            this.editableData.set(null);
        } else {
            const data = this.trackingData();
            this.editableData.set({
                phone: data.phone,
                address: data.address,
                items: data.items.map((item: any) => ({
                    product_id: item.product,
                    name: item.name,
                    quantity: item.qty,
                    price: item.price,
                    image: item.image
                }))
            });
            this.isEditing.set(true);
        }
    }

    updateItemQuantity(index: number, delta: number) {
        this.editableData.update(data => {
            const items = [...data.items];
            items[index].quantity = Math.max(1, items[index].quantity + delta);
            return { ...data, items };
        });
    }

    removeItem(index: number) {
        this.editableData.update(data => {
            const items = data.items.filter((_: any, i: number) => i !== index);
            return { ...data, items };
        });
    }

    saveOrder() {
        const data = this.editableData();
        const payload = {
            id: this.trackingData().id,
            phone: data.phone,
            address: data.address,
            items: data.items.map((item: any) => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        };

        this.isUpdating.set(true);
        this.orderService.updateOrder(payload).subscribe({
            next: (res) => {
                console.log('Order Updated:', res);
                this.isUpdating.set(false);
                this.isEditing.set(false);
                this.trackOrder(); // Reload data
            },
            error: (err) => {
                console.error('Update failed:', err);
                this.isUpdating.set(false);
                alert(this.t('track_order.update_failed'));
            }
        });
    }

    // Helper to check status level
    isStepComplete(step: string): boolean {
        const levels: Record<string, number> = {
            'placed': 1,
            'confirmed': 2,
            'packing': 3,
            'shipped': 4,
            'delivered': 5
        };
        const current = levels[this.trackingData()?.status || ''];
        const target = levels[step];
        return current >= target;
    }
}
