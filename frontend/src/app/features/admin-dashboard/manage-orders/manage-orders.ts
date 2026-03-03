import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
}

interface Order {
    _id: string;
    user: {
        username: string;
        email: string;
    };
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

@Component({
    selector: 'app-manage-orders',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-orders.html',
    styleUrl: './manage-orders.scss'
})
export class ManageOrdersComponent implements OnInit {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    orders = signal<Order[]>([]);
    selectedOrder = signal<Order | null>(null);
    loading = signal(false);

    // Mock data for initial development if backend is empty
    private mockOrders: Order[] = [
        {
            _id: 'ORD001',
            user: { username: 'Mohamed Ahmed', email: 'mohamed@example.com' },
            orderItems: [
                { name: 'Luxury Leather Handbag', qty: 1, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100', price: 450, product: '1' }
            ],
            shippingAddress: { address: '123 Nile St', city: 'Cairo', postalCode: '11511', country: 'Egypt' },
            paymentMethod: 'Credit Card',
            totalPrice: 450,
            isPaid: true,
            paidAt: new Date().toISOString(),
            isDelivered: false,
            createdAt: new Date().toISOString(),
            deliveryStatus: 'Processing'
        },
        {
            _id: 'ORD002',
            user: { username: 'Sara Hassan', email: 'sara@example.com' },
            orderItems: [
                { name: 'Silk Scarf Collection', qty: 2, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100', price: 120, product: '2' }
            ],
            shippingAddress: { address: '45 Pyramid Ave', city: 'Giza', postalCode: '12345', country: 'Egypt' },
            paymentMethod: 'Cash on Delivery',
            totalPrice: 240,
            isPaid: false,
            isDelivered: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            deliveryStatus: 'Pending'
        }
    ];

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.loading.set(true);
        const token = this.authService.token();
        const headers = new HttpHeaders({
            'Authorization': token ? `Bearer ${token}` : ''
        });

        this.http.get<Order[]>('http://localhost:5000/api/orders', { headers }).subscribe({
            next: (data) => {
                this.orders.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load orders', err);
                this.orders.set(this.mockOrders);
                this.loading.set(false);
            }
        });
    }

    viewOrderDetails(order: Order) {
        this.selectedOrder.set(order);
    }

    closeDetails() {
        this.selectedOrder.set(null);
    }

    updateStatus(orderId: string, status: string) {
        const token = this.authService.token();
        const headers = new HttpHeaders({
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        });

        this.http.put(`http://localhost:5000/api/orders/${orderId}/status`, { deliveryStatus: status }, { headers }).subscribe({
            next: () => {
                this.loadOrders();
                if (this.selectedOrder()?._id === orderId) {
                    this.selectedOrder.update(o => o ? { ...o, deliveryStatus: status as any } : null);
                }
            },
            error: (err) => {
                console.error('Failed to update status', err);
                // Update local state if mock
                this.orders.update(orders =>
                    orders.map(o => o._id === orderId ? { ...o, deliveryStatus: status as any } : o)
                );
            }
        });
    }

    getStatusClass(status: string) {
        return `status-${status.toLowerCase()}`;
    }

    formatDate(date: string) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
