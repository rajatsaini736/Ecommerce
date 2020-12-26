import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private products: ProductResponseModel[] = [];
  readonly SERVER_URL;
  constructor(
    private http: HttpClient,
  ) { 
    this.SERVER_URL = environment.ROOT_URL;
  }
    getSingleOrder(orderId: number){
      return this.http.get<ProductResponseModel[]>(`${this.SERVER_URL}/orders/${orderId}`).toPromise();
    }
}
interface ProductResponseModel{
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  quantity: number;
  image: string;
}