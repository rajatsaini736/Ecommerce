import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { init } from 'ityped';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];
  style: string;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    ) { }
    
  ngOnInit(): void {

    const name = document.getElementById('name');
    init(name, {showCursor: false, strings: ['am Rajat Saini', 'am a developer', 'love to code']})

    this.productService.getAllProducts()
      .subscribe((prods: ServerResponse) => {
        this.products = prods.products;
      });

    this.productService.getAllProducts()
      .subscribe((prods: ServerResponse) => {
        console.log(prods);
      })
  }

  selectProduct(productId: number){
    this.router.navigate(['product', productId]).then();
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

}
 