import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { ProductModelServer } from '../models/product.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly SERVER_URL;

  // DATA VARIABLE TO STORE THE CART INFO ON THE CLIENT LOCAL STORAGE
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      inCart: 0,
      id: 0
    }]
  };

  //DATA VARIABLE TO STORE THE CART INFO ON THE SERVER  ( ANGULAR & FRONT END SERVICE)
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }]
  };

  //OBSERVABLES FOR THE COMPONENTS TO SUBSCRIBE
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService)
   {
    this.SERVER_URL = environment.ROOT_URL;

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //GET THE INFO FROM LOCAL STOREAGE (if any)
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    //CHECK IF THE INFO VARIABLE IS NULL OR HAS SOME DATA IN IT
    if (info != null && info != undefined && info.prodData[0].inCart != 0){
      //local storage is not empty and has some info
      this.cartDataClient = info;

      //loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id)
          .subscribe((actualProductInfo: ProductModelServer) => { 
            if( this.cartDataServer.data[0].numInCart == 0){
              this.cartDataServer.data[0].numInCart = p.inCart;
              this.cartDataServer.data[0].product = actualProductInfo;
              // TODO Create CalculateTotal Function and replace it here
              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else{
              //CART DATASERVER ALREADY HAS SOME ENTRY IN IT
              this.cartDataServer.data.push({
                numInCart: p.inCart,
                product: actualProductInfo
              });
              //TODO
              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({...this.cartDataServer});
          });
      });
      this.cartTotal$.next(this.cartDataServer.total);
    }
  }

  AddProductToCart(id: number, quantity?: number){

    this.productService.getSingleProduct(id)
      .subscribe(prod => {
        // 1. if the cart is empty
        if( this.cartDataServer.data[0].product === undefined){
          this.cartDataServer.data[0].product = prod;
          this.cartDataServer.data[0].numInCart = quantity != undefined ? quantity : 1;


            //TODO calculate total amount
          this.calculateTotal();
          this.cartDataClient.prodData[0].inCart = this.cartDataServer.data[0].numInCart;
          this.cartDataClient.prodData[0].id = prod.id;
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});

          this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        // 2. if the cart has some items

        else{
          let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id); //-1 or a positive number
          //   a. if that item is already in the cart => index is positive
          if (index != -1){
            if( quantity !== undefined && quantity <= prod.quantity ){
              this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
            } else{
              this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart+1 : prod.quantity;
            }
            this.calculateTotal();
            // console.log(this.cartDataServer);
            this.cartDataClient.prodData[index].inCart = this.cartDataServer.data[index].numInCart;
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

            // TODO display a toast notification
            this.toast.info(`${prod.name} quantity updated in the cart`, 'Product Updated', {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
          } else{
          //   b. if that item is not in the cart
            this.cartDataServer.data.push({
              numInCart: 1,
              product: prod
            });

            this.cartDataClient.prodData.push({
              id: prod.id,
              inCart: 1
            });
            this.calculateTotal();
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

            // TODO display a toast notification
            this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({...this.cartDataServer});
          }
          
        }

      });
  }

  UpdateCartItems(index: number, increase: boolean){
    let data = this.cartDataServer.data[index];

    if (increase){
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].inCart = data.numInCart;
      // TODO calculate total amount
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    } else{
      data.numInCart--;

      if (data.numInCart < 1){
        //TODO delete the product from cart
        this.DeleteProductFromCart(index);
        this.cartData$.next({...this.cartDataServer});
      } else{
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].inCart = data.numInCart;
        // TODO calculate total amount
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index: number){
    if(window.confirm("Are you sure you want to remove the item?")){
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
        // TODO calculate total amount
      this.calculateTotal();
      console.log(this.cartDataServer.data, index);
      this.cartDataClient.total = this.cartDataServer.total; 

      if ( this.cartDataClient.total === 0){
        this.cartDataClient = { total: 0, prodData: [{inCart: 0,id: 0}]};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); 
      } else{
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient)); 
      }

      if (this.cartDataServer.total === 0){
        this.cartDataServer = { total: 0, data: [{ numInCart: 0, product: undefined }]};
        this.cartData$.next({...this.cartDataServer});
      } else{
        this.cartData$.next({...this.cartDataServer});
      }

    } else{
      // if the user click the cancel button
      return ;
    }
  }

  private calculateTotal(){
    let Total = 0;

    this.cartDataServer.data.forEach( p => {
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  CalculateSubTotal(index): number{
    let subTotal = 0;

    const p = this.cartDataServer.data[index];

    subTotal = p.product.price * p.numInCart;

    return subTotal;
  }

  CheckoutFromCart(userId: number){
    this.http.post(`${this.SERVER_URL}/orders/payment`, null)
      .subscribe((res: {success: boolean}) => {
        if (res.success){
          this.resetServerData();
          this.http.post(`${this.SERVER_URL}/orders/new`, { 
            userId: userId,
            products: this.cartDataClient.prodData
          }).subscribe((data: OrderResponse) => {

            this.orderService.getSingleOrder(data.order_id)
              .then((prods) =>{
                if( data.success){
                  const navigationExtras: NavigationExtras = {
                    state: {
                      message: data.message,
                      products: prods,
                      order_id: data.order_id,
                      total: this.cartDataClient.total
                    }
                  };
                  // TODO HIDE spinner
                  this.spinner.hide();
                  this.router.navigate(['/thankyou'], navigationExtras).then( p => {
                    this.cartDataClient = { total: 0, prodData: [{inCart: 0,id: 0}]};
                    this.cartTotal$.next(0);
                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                  });
                }
              });
          });
        } else{
          this.spinner.hide();
          this.router.navigateByUrl('/checkout').then();
          this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      });
  }

  private resetServerData(){
    this.cartDataServer = { total: 0, data: [{ numInCart: 0, product: undefined}]};
    this.cartData$.next({...this.cartDataServer});
  }

}

interface OrderResponse{
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }];
}
