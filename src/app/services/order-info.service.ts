import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class OrderInfoService {
  orders: any = [];
  orderId: any;

  constructor(public http: HttpClient) { }

  orderInfo: any = []
  
  OrderInfo(order: any){
    this.orderInfo.push({ 
      id: order.customerOrderId,
      customerid: order.customerId,
      amount: order.orderAmount,
      datePlaced: order.orderDatePlaced,
      dateCollected: order.orderDateCollected,
      orderStatus: order.customerOrderStatus,
      customer: order.customer
    })
  }

  retrieveOrderInfo(){
    let retrievedUserInfo = this.orderInfo
 
     return retrievedUserInfo
   }
 
   clearData(){
     this.orderInfo = [];
   }

   getLastOrder(){
   return this.http.get(`${API_URL}/CustomerOrder/GetCustomerOrders`)
    .subscribe(results => { this.orders = results;
  let lastOrder = this.orders.slice(-1)
  this.orderId = lastOrder[0].customerOrderId + 1
  localStorage.setItem('orderId', this.orderId);
})
   }
}
