import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductDetailComponent
  },
  {
    path: '',
    // your home is app component content — or use a HomeComponent
    pathMatch: 'full',
    children: [] // if home stays in App component, see step 4
  }
];