import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProductModelServer, ProductsServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly SERVER_URL;
  readonly BASE_URL;
  constructor(
    private http : HttpClient,
    private router: Router
  ) {
      this.SERVER_URL = environment.ROOT_URL;
   }

   getAllProducts(maximumLimit ?: number ):Observable<ProductsServerResponse>{
    return this.http.get<ProductsServerResponse>(`${this.SERVER_URL}/products`, { 
      params: {
        limit: maximumLimit.toString()
      }
    });
  }

  addProduct(catId: number, title: string, quantity: number, description: string, short_desc: string, image: string, images: string, price: number):Observable<addProductServerResponse>{
    return this.http.post<addProductServerResponse>(`${this.SERVER_URL}/products/add`,{
      productCatId : catId,
      productTitle : title, 
      productDescription : description, 
      productQuantity : quantity, 
      productImage : image, 
      productImages : images, 
      productShortDesc : short_desc, 
      productPrice : price
    });
  }
  
  deleteProduct(id: number):Observable<deleteServerResponse>{
    return this.http.delete<deleteServerResponse>(`${this.SERVER_URL}/products/delete/${id}`)
      .pipe(
        switchMap( async(data) =>{
          const prods: ProductsServerResponse  = await this.getAllProducts(500).toPromise();
          return {
            ...data,
            ...prods
          };
        })
      );
  }

  uploadImage(formData : FormData){
    return this.http.post(`${this.SERVER_URL}/products/upload`, formData);
  }

  uploadImages(formData: FormData){
    return this.http.post(`${this.SERVER_URL}/products/upload-files`, formData);
  }

}

interface deleteServerResponse{
  status: string;
  message: string;
  products: ProductModelServer[];
}

interface addProductServerResponse{
  status: string;
  message: string;
}