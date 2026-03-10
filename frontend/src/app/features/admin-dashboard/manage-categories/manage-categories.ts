import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../../core/services/translation.service';

interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    productCount: number;
    featured: boolean;
}

interface CategoryForm {
    name: string;
    description: string;
    image: string;
    featured: boolean;
}

@Component({
    selector: 'app-manage-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-categories.html',
    styleUrl: './manage-categories.scss'
})
export class ManageCategoriesComponent implements OnInit {
    private http = inject(HttpClient);
    public translationService = inject(TranslationService);
    t = this.translationService.translate.bind(this.translationService);

    categories = signal<Category[]>([
        {
            id: '1',
            name: 'Bags',
            description: 'Luxury handbags and designer bags',
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
            productCount: 45,
            featured: true
        },
        {
            id: '2',
            name: 'Perfumes',
            description: 'Premium fragrances and colognes',
            image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
            productCount: 32,
            featured: true
        },
        {
            id: '3',
            name: 'Scarfs',
            description: 'Elegant silk and designer scarfs',
            image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400',
            productCount: 28,
            featured: false
        },
        {
            id: '4',
            name: 'Accessories',
            description: 'Watches, sunglasses, and jewelry',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
            productCount: 56,
            featured: true
        }
    ]);

    showForm = signal(false);
    editingCategory = signal<Category | null>(null);

    formData: CategoryForm = {
        name: '',
        description: '',
        image: '',
        featured: false
    };

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.http.get<Category[]>('http://localhost:5000/api/categories').subscribe({
            next: (data) => {
                if (data && data.length > 0) {
                    this.categories.set(data);
                }
            },
            error: (err) => {
                console.log('Using mock categories - backend not available');
            }
        });
    }

    addCategory() {
        this.editingCategory.set(null);
        this.formData = {
            name: '',
            description: '',
            image: '',
            featured: false
        };
        this.showForm.set(true);
    }

    editCategory(category: Category) {
        this.editingCategory.set(category);
        this.formData = {
            name: category.name,
            description: category.description,
            image: category.image,
            featured: category.featured
        };
        this.showForm.set(true);
    }

    saveCategory() {
        const categoryData: Category = {
            id: this.editingCategory()?.id || Date.now().toString(),
            name: this.formData.name,
            description: this.formData.description,
            image: this.formData.image,
            productCount: this.editingCategory()?.productCount || 0,
            featured: this.formData.featured
        };

        if (this.editingCategory()) {
            // Update existing category
            this.http.put(`http://localhost:5000/api/categories/${categoryData.id}`, categoryData).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeForm();
                },
                error: (err) => {
                    console.error('Failed to update category', err);
                    this.categories.update(categories =>
                        categories.map(c => c.id === categoryData.id ? categoryData : c)
                    );
                    this.closeForm();
                }
            });
        } else {
            // Create new category
            this.http.post('http://localhost:5000/api/categories', categoryData).subscribe({
                next: () => {
                    this.loadCategories();
                    this.closeForm();
                },
                error: (err) => {
                    console.error('Failed to create category', err);
                    this.categories.update(categories => [...categories, categoryData]);
                    this.closeForm();
                }
            });
        }
    }

    deleteCategory(id: string) {
        if (confirm('Are you sure you want to delete this category? All products in this category will be affected.')) {
            this.http.delete(`http://localhost:5000/api/categories/${id}`).subscribe({
                next: () => this.loadCategories(),
                error: (err) => {
                    console.error('Failed to delete category', err);
                    this.categories.update(categories => categories.filter(c => c.id !== id));
                }
            });
        }
    }

    closeForm() {
        this.showForm.set(false);
        this.editingCategory.set(null);
    }
}
