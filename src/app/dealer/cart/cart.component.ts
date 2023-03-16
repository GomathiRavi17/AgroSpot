import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';
import { CropDetails } from 'src/app/cropdetails/cropdetails';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CropDetails[] = JSON.parse(localStorage.getItem("localCart")!);
  paymentHandler: any = null;

  totalPrice: number = 0;

  dname: string = '';

  private unsubscriber : Subject<void> = new Subject<void>();

  constructor(
    private route:ActivatedRoute, 
    private authService: AuthService,
    private router: Router
    ){
    
  }

  ngOnInit(){

    this.route.paramMap.subscribe(
      (param) => {
        this.dname = param.get('name')!;
      }
     );

    this.calTotPrice();

   
    // this.checkOut()

    this.invokeStripe();

    history.pushState(null,'', location.href);
    fromEvent(window, 'popstate').pipe(
     takeUntil(this.unsubscriber)
   ).subscribe((_) => {
     history.pushState(null, '');
     alert(`You can't go back at this time.`);
   });

   
    
  }

  removeCartItem(cid: number){
    this.cartItems = this.cartItems.filter( (crop) => cid !== crop.cid);
    localStorage.setItem("localCart",JSON.stringify(this.cartItems));
    location.reload()
  }

  removeall(){
    this.cartItems = [];
    localStorage.removeItem("localCart");
    location.reload();
  }

  addItem(crop: CropDetails) {
    if (crop.quantity != 10) {
      crop.quantity += 1;
    }
    this.totalPrice += crop.price;
  }

  removeItem(crop: CropDetails) {
    if (crop.quantity != 1) {
      crop.quantity -= 1;
    }
    this.totalPrice -= crop.price;
  }

  calTotPrice(){
    for(let i=0; i<this.cartItems.length;i++){
      let price = this.cartItems[i].price * this.cartItems[i].quantity;
      this.totalPrice += price;
    }
  }

  orderId = () => String(Math.round(Date.now() * Math.random()));
 

  // checkOut(){
  //   var a = document.getElementById("checkOut");
  //   a?.setAttribute("href", "http://localhost:1006/payment?orderId="+this.orderId()+"&custId="+this.dname+"&txn_amt="+this.totalPrice);
  // }

  logout(){
    this.authService.loggedOut();
  }

  makePayment() {
   
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51MlGthSFL5yYFWX5A480TmDIfHrCKkEW8QHRkofgNS9URM7rX1l7C0O7BTKQjazJ9sONwMGOx3GZ5Hcrgnf2HfZb00mHR9R4Ip',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
        alert('Payment Successfull!');
      },
    });
    paymentHandler.open({
      name: 'Agro Spot',
      // description: 'Payment',
      amount: this.totalPrice * 100,
    });
    localStorage.removeItem("localCart");
  }
 
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51MlGthSFL5yYFWX5A480TmDIfHrCKkEW8QHRkofgNS9URM7rX1l7C0O7BTKQjazJ9sONwMGOx3GZ5Hcrgnf2HfZb00mHR9R4Ip',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
            
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
