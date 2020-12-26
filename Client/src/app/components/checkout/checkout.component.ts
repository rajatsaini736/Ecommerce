import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartTotal: number;
  cartData: CartModelServer;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  
  this.cartService.cartData$.subscribe((data) => {
    this.cartData = data
  });

  this.cartService.cartTotal$.subscribe((total) => {
    this.cartTotal = total;
  })
  }

  onCheckout(){
    this.spinner.show();
    
    this.cartService.CheckoutFromCart(1);
}
}