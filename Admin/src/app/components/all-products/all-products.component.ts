import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductModelServer, ProductsServerResponse } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  prods : ProductModelServer[];
  subs: Subscription[] = [];
  errorMessage: string;
  hasError: boolean = false;
  success: boolean = false;

  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit(): void {  
    this.hasError = false;
    this.subs.push(this.productService.getAllProducts(500).subscribe((products: ProductsServerResponse) => {
      this.prods = products.products;
    }));
  }

  ngOnDestroy(): void{
    this.subs.map((s)=> s.unsubscribe());
  }

  deleteProduct(id: number){
    this.subs.push(this.productService.deleteProduct(id).subscribe(res => {
      if(res.status == 'failure'){
        this.hasError = true;
        this.errorMessage = res.message;
        return;
      }
      if(res.status == 'success'){
        this.success = true;
        this.errorMessage = res.message;
      }

      this.prods = res.products;    
      // $('.alert').delay(1500).hide(); 
    }));
  }
}
