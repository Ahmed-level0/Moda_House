import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
    { path: 'products/on-sale', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
    { path: 'products/style/:style', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
    { path: 'products/:category', loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) },
    { path: 'product/:id', loadComponent: () => import('./features/products/product-details/product-details').then(m => m.ProductDetails) },
    { path: 'wishlist', loadComponent: () => import('./features/wishlist/wishlist').then(m => m.WishlistComponent) },
    { path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent) },
    { path: 'checkout/success', loadComponent: () => import('./features/checkout/order-success/order-success').then(m => m.OrderSuccessComponent) },
    { path: 'track-order', loadComponent: () => import('./features/track-order/track-order').then(m => m.TrackOrderComponent) },
    { path: 'auth', loadComponent: () => import('./features/auth/auth').then(m => m.AuthComponent) },
    { path: 'profile', loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent) },
    { path: 'admin', loadComponent: () => import('./features/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent), canActivate: [adminGuard] },
    { path: 'contact', loadComponent: () => import('./features/contact/contact').then(m => m.ContactComponent) },
    { path: 'about-us', loadComponent: () => import('./features/about/about').then(m => m.AboutComponent) },
    { path: 'shipping-policy', loadComponent: () => import('./features/policies/shipping-policy').then(m => m.ShippingPolicyComponent) },
    { path: 'refund-policy', loadComponent: () => import('./features/policies/refund-policy').then(m => m.RefundPolicyComponent) },
    { path: 'order-cancellation-policy', loadComponent: () => import('./features/policies/order-cancellation-policy').then(m => m.OrderCancellationPolicyComponent) },
    { path: 'faq', loadComponent: () => import('./features/faq/faq').then(m => m.FAQComponent) },
    { path: '**', redirectTo: '' }
];
