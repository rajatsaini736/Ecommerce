import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  message: string;
  orderId: number;
  products: ProductResponseModel[] = [];
  cartTotal: number;

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      message: string,
      products: ProductResponseModel[],
      order_id: number,
      total: number
    };

    this.message = state.message;
    this.products = state.products;
    this.orderId = state.order_id;
    this.cartTotal = state.total;

    

   }

  ngOnInit(): void {
  }

}

interface ProductResponseModel{
  id: number;
  description: string;
  title: string;
  quantityOrdered: number;
}
