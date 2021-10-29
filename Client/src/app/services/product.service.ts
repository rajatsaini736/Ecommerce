import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly SERVER_URL;
  constructor(private http: HttpClient) { 
    this.SERVER_URL = environment.ROOT_URL;
  }

  getAllProducts():Observable<ServerResponse>{
    return this.http.get<ServerResponse>("https://jsonplaceholder.typicode.com/postss");
    // return this.http.get<ServerResponse>(`${this.SERVER_URL}/products`);
  }  

  // getAllProductsWithLimit(numberOfResults?: number):Observable<ServerResponse>{
  //   return this.http.get<ServerResponse>(`${this.SERVER_URL}/products`,{
  //     params: {
  //       limit: numberOfResults.toString()
  //     }
  //   });
  // }  

  /* GET SINGLE PRODUCT*/
  getSingleProduct(id: number):Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(`${this.SERVER_URL}/products/${id}`);
  }

  /*GET PRODUCT FROM ONE CATEGORY*/
  getProductFromCategory(catName: string):Observable<ServerResponse>{
    return this.http.get<ServerResponse>(`${this.SERVER_URL}/products/category/${catName}`);
  }

}

