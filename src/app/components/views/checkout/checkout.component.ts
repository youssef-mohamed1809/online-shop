import { AnimateTimings } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalOrder } from 'src/app/interfaces/finalOrder';
import { shipping } from 'src/app/interfaces/shipping';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public data:any;
  public boughtProducts:any;
  public subtotal = 0;
  public total = 0;
  public order:any;

  orderData = new FormGroup({
    first_name: new FormControl,
    last_name: new FormControl,
    email: new FormControl,
    mobile: new FormControl,
    address1: new FormControl,
    address2: new FormControl,
    country: new FormControl,
    city: new FormControl,
    state: new FormControl,
    zip: new FormControl
  })
  
  constructor(
    public authService: AuthService,
    private http: HttpClient
  ) { 

   }

  ngOnInit(): void {
    this.data = localStorage.getItem('loginData');
    this.data = JSON.parse(this.data);

    this.boughtProducts = localStorage.getItem('order');
    this.boughtProducts = JSON.parse(this.boughtProducts);

    for(let i = 0; i < this.boughtProducts.orderDetails.length; i++){
      let price = (this.boughtProducts.orderDetails[i].product.price);
      let discount = (this.boughtProducts.orderDetails[i].product.discount);
      let quantity = (this.boughtProducts.orderDetails[i].quantity);
      price -= price*discount;
      price *=  quantity;
      this.subtotal += price;
    }

    this.total = this.subtotal + 10;

    this.orderData.setValue({
      first_name: this.data.first_name,
      last_name: this.data.last_name,
      email: this.data.email,
      mobile: "",
      address1: "",
      address2: "",
      country: "",
      city: "",
      state: "",
      zip: ""
    })
    
  }

  sendData(): void{
    this.order = localStorage.getItem('order');
    this.order = JSON.parse(this.order);

    let shipping_information = new shipping;
    shipping_information.first_name = this.orderData.value.first_name;
    shipping_information.last_name = this.orderData.value.last_name;
    shipping_information.email = this.orderData.value.email;
    shipping_information.mobile_number = this.orderData.value.mobile;
    shipping_information.address1 = this.orderData.value.address1;
    shipping_information.address2 = this.orderData.value.address2;
    shipping_information.country = this.orderData.value.country;
    shipping_information.city = this.orderData.value.city;
    shipping_information.state = this.orderData.value.state;
    shipping_information.zip_code = this.orderData.value.zip;

    let fo = new finalOrder;
    fo.sub_total_price = this.subtotal;
    fo.shipping = 10;
    fo.total_price = this.total;
    fo.user_id = this.data._id;
    fo.order_date = "18/10/2022";
    fo.order_details = this.order;
    fo.shipping_info = shipping_information;

    this.http.post(`${environment.APIUrl}/orders?token=${this.data.token}`, fo);    
  }


}
