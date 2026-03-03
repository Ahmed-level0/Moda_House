import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
    id: number;
    name: string;
    brand: any; // Can be string or object
    category: any; // Can be string or object
    price: number;
    final_price?: number;
    discount: number;
    discountPrice?: number;
    stock: number;
    description: string;
    images: { id: number, image: string }[];
    image?: string;
    image1?: string;
    image2?: string;
    sizes?: string[]; // Kept for backward compatibility if needed
    colors?: any[]; // Kept for backward compatibility if needed
    style?: string | null;
    color?: string | null;
    size?: string | null;
    material?: string | null;
    notes?: { top: string, middle: string, base: string };
    shippingInfo?: string;
    returnsInfo?: string;
    isNew?: boolean;
    onSale?: boolean;
    isBestSeller?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/products`;
    private categoryMapping: Record<number, string> = {
        1: 'Bags',
        2: 'Scarfs',
        3: 'Perfumes',
        4: 'Accessories'
    };

    getProducts(categoryId?: number | string, discounted?: boolean, color?: string, style?: string): Observable<Product[]> {
        let url = `${this.apiUrl}/`;
        const params: string[] = [];
        if (categoryId && categoryId !== 'all') {
            params.push(`category=${categoryId}`);
        }
        if (discounted) {
            params.push('discounted=true');
        }
        if (color && color !== 'all') {
            params.push(`color=${color.toLowerCase()}`);
        }
        if (style && style !== 'all') {
            params.push(`style=${style.toLowerCase()}`);
        }
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        return this.http.get<Product[]>(url).pipe(
            map(products => products.map(p => this.transformProduct(p)))
        );
    }

    getDiscountedProducts(): Observable<Product[]> {
        return this.getProducts(undefined, true);
    }

    getProduct(id: string | number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}/`).pipe(
            map(p => this.transformProduct(p))
        );
    }

    private transformProduct(p: any): Product {
        const images = p.images || [];
        const categoryName = typeof p.category === 'object' ? p.category.name : (this.categoryMapping[p.category] || p.category);
        const brandName = typeof p.brand === 'object' ? p.brand.name : (p.brand === 1 ? 'Zara' : p.brand);

        return {
            ...p,
            id: p.id,
            final_price: Number(p.final_price),
            discount: Number(p.discount),
            price: Number(p.price),
            category: categoryName,
            brand: brandName,
            // Fallback for UI components expecting a single image string
            image: images.length > 0 ? images[0].image : p.image || p.image1,
            images: images
        };
    }
}
