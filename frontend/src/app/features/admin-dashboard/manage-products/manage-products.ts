import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../../core/services/translation.service';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discount?: number;
    finalPrice?: number;
    category: string;
    image: string;
    colors?: string[];
    stock: number;
    featured: boolean;
}

interface ProductForm {
    name: string;
    description: string;
    price: number;
    discount: number;
    category: string;
    image: string;
    colors: string[];
    stock: number;
    featured: boolean;
}

@Component({
    selector: 'app-manage-products',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-products.html',
    styleUrl: './manage-products.scss'
})
export class ManageProductsComponent implements OnInit {
    private http = inject(HttpClient);
    public translationService = inject(TranslationService);

    t = this.translationService.translate.bind(this.translationService);

    // Mock products for demonstration
    products = signal<Product[]>([
        {
            id: '1',
            name: 'Luxury Leather Handbag',
            description: 'Premium Italian leather handbag with gold hardware',
            price: 450,
            discount: 10,
            finalPrice: 405,
            category: 'Bags',
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
            colors: ['#8B4513', '#000000', '#C19A6B'],
            stock: 15,
            featured: true
        },
        {
            id: '2',
            name: 'Chanel No. 5 Perfume',
            description: 'Classic fragrance for the modern woman',
            price: 250,
            category: 'Perfumes',
            image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
            stock: 30,
            featured: true
        },
        {
            id: '3',
            name: 'Silk Scarf Collection',
            description: 'Hand-printed silk scarf with elegant patterns',
            price: 120,
            discount: 15,
            finalPrice: 102,
            category: 'Scarfs',
            image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400',
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            stock: 25,
            featured: false
        },
        {
            id: '4',
            name: 'Designer Sunglasses',
            description: 'UV protection with style',
            price: 300,
            category: 'Accessories',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
            colors: ['#000000', '#8B4513'],
            stock: 8,
            featured: false
        },
        {
            id: '5',
            name: 'Premium Watch',
            description: 'Swiss-made luxury timepiece',
            price: 1200,
            discount: 20,
            finalPrice: 960,
            category: 'Accessories',
            image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
            colors: ['#C0C0C0', '#FFD700', '#000000'],
            stock: 5,
            featured: true
        }
    ]);

    showForm = signal(false);
    editingProduct = signal<Product | null>(null);

    formData: ProductForm = {
        name: '',
        description: '',
        price: 0,
        discount: 0,
        category: 'Bags',
        image: '',
        colors: [],
        stock: 0,
        featured: false
    };

    newColor = '';

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.http.get<Product[]>('http://localhost:5000/api/products').subscribe({
            next: (data) => {
                if (data && data.length > 0) {
                    this.products.set(data);
                }
            },
            error: (err) => {
                console.log('Using mock products - backend not available');
                // Keep mock data
            }
        });
    }

    addProduct() {
        this.editingProduct.set(null);
        this.formData = {
            name: '',
            description: '',
            price: 0,
            discount: 0,
            category: 'Bags',
            image: '',
            colors: [],
            stock: 0,
            featured: false
        };
        this.showForm.set(true);
    }

    editProduct(product: Product) {
        this.editingProduct.set(product);
        this.formData = {
            name: product.name,
            description: product.description,
            price: product.price,
            discount: product.discount || 0,
            category: product.category,
            image: product.image,
            colors: product.colors || [],
            stock: product.stock,
            featured: product.featured
        };
        this.showForm.set(true);
    }

    saveProduct() {
        const form = this.formData;

        // Calculate final price
        const finalPrice = form.discount > 0
            ? form.price - (form.price * form.discount / 100)
            : form.price;

        const productData: Product = {
            id: this.editingProduct()?.id || Date.now().toString(),
            name: form.name,
            description: form.description,
            price: form.price,
            discount: form.discount,
            finalPrice: finalPrice,
            category: form.category,
            image: form.image,
            colors: form.colors,
            stock: form.stock,
            featured: form.featured
        };

        if (this.editingProduct()) {
            // Update existing product
            this.http.put(`http://localhost:5000/api/products/${productData.id}`, productData).subscribe({
                next: () => {
                    this.loadProducts();
                    this.closeForm();
                },
                error: (err) => {
                    console.error('Failed to update product', err);
                    // Update mock data
                    this.products.update(products =>
                        products.map(p => p.id === productData.id ? productData : p)
                    );
                    this.closeForm();
                }
            });
        } else {
            // Create new product
            this.http.post('http://localhost:5000/api/products', productData).subscribe({
                next: () => {
                    this.loadProducts();
                    this.closeForm();
                },
                error: (err) => {
                    console.error('Failed to create product', err);
                    // Add to mock data
                    this.products.update(products => [...products, productData]);
                    this.closeForm();
                }
            });
        }
    }

    deleteProduct(id: string) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.http.delete(`http://localhost:5000/api/products/${id}`).subscribe({
                next: () => this.loadProducts(),
                error: (err) => {
                    console.error('Failed to delete product', err);
                    // Remove from mock data
                    this.products.update(products => products.filter(p => p.id !== id));
                }
            });
        }
    }

    closeForm() {
        this.showForm.set(false);
        this.editingProduct.set(null);
    }

    addColor() {
        const color = this.newColor.trim();
        if (color && !this.formData.colors.includes(color)) {
            this.formData.colors.push(color);
            this.newColor = '';
        }
    }

    removeColor(color: string) {
        this.formData.colors = this.formData.colors.filter(c => c !== color);
    }

    getFinalPrice(): number {
        const form = this.formData;
        if (form.discount > 0) {
            return form.price - (form.price * form.discount / 100);
        }
        return form.price;
    }
}
