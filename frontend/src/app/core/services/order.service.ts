import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private baseUrl = `${environment.apiUrl}/api/orders`;

    private getHeaders() {
        const token = this.authService.token();
        return new HttpHeaders({
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        });
    }

    getOrder(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/order_details/${id}/`, { headers: this.getHeaders() });
    }

    updateOrder(data: { id: string, phone: string, address: string, items: { product_id: number, quantity: number }[] }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/update_order/`, data, { headers: this.getHeaders() });
    }
}
