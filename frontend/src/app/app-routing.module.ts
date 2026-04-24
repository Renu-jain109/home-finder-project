import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'listings',
    loadComponent: () => import('./components/listings/listings.component').then(m => m.ListingsComponent)
  },
  {
    path: 'property/:id',
    loadComponent: () => import('./components/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
  },
  {
    path: 'add-property',
    loadComponent: () => import('./components/add-property/add-property.component').then(m => m.AddPropertyComponent)
  },
  {
    path: 'edit-property/:id',
    loadComponent: () => import('./components/add-property/add-property.component').then(m => m.AddPropertyComponent)
  },
  {
    path: 'split-view',
    loadComponent: () => import('./components/split-view/split-view.component').then(m => m.SplitViewComponent)
  },
  {
    path: 'my-properties',
    loadComponent: () => import('./components/my-properties/my-properties.component').then(m => m.MyPropertiesComponent)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
