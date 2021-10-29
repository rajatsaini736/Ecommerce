import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AllCategoriesComponent } from './components/all-categories/all-categories.component';
import { AddNewCategoryComponent } from './components/add-new-category/add-new-category.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

@NgModule({
  declarations: [
    AppComponent,
    AllProductsComponent,
    HeaderComponent,
    FooterComponent,
    MainContentComponent,
    SidebarComponent,
    AllCategoriesComponent,
    AddNewCategoryComponent,
    AddNewProductComponent,
    UploadFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
