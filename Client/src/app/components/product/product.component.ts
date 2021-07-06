import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { HomeComponent } from '../home/home.component';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {

  productId: number;
  product: ProductModelServer;3
  thumbImages: any[] = [];

  @ViewChild('quantity') quantityInput;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {   
    this.route.params.subscribe((params: Params) => {
      this.productId = params.id;

      this.productService.getSingleProduct(this.productId).subscribe((product: ProductModelServer) => {
        this.product = product;
        // console.log(this.product);
        if (product.images != null){
          this.thumbImages = product.images.split(',');
        }
      });
    });


    // this.productService.getProductFromCategory("Shoes").subscribe((prods: ServerResponse) => {
    //   console.log(prods);
    // });
  }

  ngAfterViewInit(): void {
    // Product Main img Slick
        $('#product-main-img').slick({
          infinite: true,
          speed: 300,
          dots: false,
          arrows: true,
          fade: true,
          asNavFor: '#product-imgs',
        });
    
        // Product imgs Slick
        $('#product-imgs').slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          centerMode: true,
          focusOnSelect: true,
          centerPadding: 0,
          vertical: true,
          asNavFor: '#product-main-img',
          responsive: [{
            breakpoint: 991,
            settings: {
              vertical: false,
              arrows: false,
              dots: true,
            }
          },
          ]
        });
    
        // Product img zoom
        // tslint:disable-next-line:prefer-const
        // const zoomMainProduct = document.getElementById('product-main-img');
        // if (zoomMainProduct) {
        //   $('#product-main-img .product-preview').zoom();
        // }
      }

  Increase(){
    let value = parseInt(this.quantityInput.nativeElement.value);

    if( this.product.quantity >= 1){
      value++;

      if( value > this.product.quantity ){
        value = this.product.quantity;
      }
    } else{
      return ;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  Decrease(){
    let value = parseInt(this.quantityInput.nativeElement.value);

    if( this.product.quantity > 0){
      value--;

      if( value <= 0 ){
        value = 1;
      }
    } else{
      return ;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  addToCart(id: number){


    this.cartService.AddProductToCart(id, this.quantityInput.nativeElement.value);
  }



}
