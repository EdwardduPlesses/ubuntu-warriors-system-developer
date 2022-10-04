import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {
  orders: any = [];
  orderId: any;
  progressBar: boolean = false;

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

   async getOrders() :Promise<any>{
   let httpCall = this.http.get(`${API_URL}/CustomerOrder/GetCustomerOrders`)
   let response = await lastValueFrom(httpCall)
   return response
   }

   async completeOrder(order: any, completedOrder: any) :Promise<any>{
    let httpCall = this.http.put(`${API_URL}/CustomerOrder/UpdateOrderStatus?customerOrderID=${order.customerOrderId}`, completedOrder)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async getLastOrder(){
    let httpCall = this.http.get(`${API_URL}/CustomerOrder/GetCustomerOrders`)
    let response = await lastValueFrom(httpCall)
   return response
    }

    async GetCustomers(){
       let httpCall = this.http.get(API_URL + "/Customer/GetAllCustomers")
        let response = await lastValueFrom(httpCall)
        return response
      }

    async GetProducts(){
      let httpCall = this.http.get(API_URL + `/Product/GetProducts`)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async confirmAdd(order: any){
         let httpCall = this.http.post(`${API_URL}/CustomerOrder/AddCustomerOrder`, order)
         let response = await lastValueFrom(httpCall)
         return response
      }
    
      async confirmOrderLine(orderline: any) {
        let httpCall = this.http.post(`${API_URL}/CustomerOrder/AddOrderLine`,orderline)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async collectOrder(orderID: any, updatedOrder: any) {
        let httpCall = this.http.put(`${API_URL}/CustomerOrder/CollectOrder?customerOrderID=${orderID}`, updatedOrder)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async updateOrderStatus(orderID: any, updatedOrder: any) {
        let httpCall = this.http.put(`${API_URL}/CustomerOrder/UpdateOrderStatus?customerOrderID=${orderID}`, updatedOrder)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async getOrderLines(orderID: any){
       let httpCall = this.http.get(`${API_URL}/CustomerOrder/GetCustomerOrderLines?customerOrderID=${orderID}`)
       let response = await lastValueFrom(httpCall)
       return response
    }

    async getAuditTrail(){
      let httpCall = this.http.get(`${API_URL}/AuditTrail/GetAuditTrails`)
      let response = await lastValueFrom(httpCall)
      return response
    }

    async addAuditTrail(audit: any){
      let httpCall = this.http.post(`${API_URL}/AuditTrail/AddAuditTrail`, audit)
      let response = await lastValueFrom(httpCall)
      return response
    }
}
