import { Routes } from '@angular/router';

import { LoginComponent }
  from './features/auth/login/login';

import { RegisterComponent }
  from './features/auth/register/register';
import { HomeComponent } from './features/home/home/home';

import { authGuard }
  from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },


  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout')
        .then(m => m.MainLayout),
    children: [

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home/home')
            .then(m => m.HomeComponent)
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'productslist',
        loadComponent: () =>
          import('./features/products/product-lists/product-lists')
            .then(m => m.ProductListsComponent)
      },

      {
        path: 'videos',
        loadComponent: () =>
          import('./features/videos/video-gallery/video-gallery')
            .then(m => m.VideoGalleryComponent)
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/cart')
            .then(m => m.CartComponent)
      }
      ,
      {
        path: 'cartnew',
        loadComponent: () =>
          import('./features/cartnew/cartnew')
            .then(m => m.CartComponent)
      }
      ,
      {
        path: 'product-details/:id',
        loadComponent: () =>
          import('./features/products/product-details/product-details')
            .then(m => m.ProductDetailsComponent)
      }

    ]

  },
  {
    path: 'adminproduct',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout')
        .then(m => m.AdminLayout),
    children: [
      {
        path: 'product', loadChildren: () => import('./features/admin/products/products').then(m => m.Products)
      }
    ]
  }

];