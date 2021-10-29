import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewCategoryComponent } from './components/add-new-category/add-new-category.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { AllCategoriesComponent } from './components/all-categories/all-categories.component';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

const routes: Routes = [
  { path: '', component: MainContentComponent }, 
  { path: 'all-products', component: AllProductsComponent },
  { path: 'all-categories', component: AllCategoriesComponent },
  { path: 'add-new-category', component: AddNewCategoryComponent },
  { path: 'add-new-product', component: AddNewProductComponent },
  { path: 'upload-file', component: UploadFileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
