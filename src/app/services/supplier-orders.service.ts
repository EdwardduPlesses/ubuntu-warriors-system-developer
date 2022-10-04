import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})

export class SupplierOrderService {

  orders: any = [];
  orderId: any;

    constructor(private httpClient: HttpClient) { }

  orderInfo: any = []

    //Get Suppliers Orders 1
  async GetSupplierOrders(): Promise<any> {
    let httpCall = this.httpClient.get(`${API_URL}/SupplierOrder/GetSupplierOrders`)
    let response = await lastValueFrom(httpCall)
    return response
  }

      //Get Suppliers 2
      async GetSuppliers(): Promise<any> {
        let httpCall = this.httpClient.get(`${API_URL}/Supplier/GetAllSuppliers`)
        let response = await lastValueFrom(httpCall)
        return response
      }

        //Get Products 3
        async GetProducts(): Promise<any> {
          let httpCall = this.httpClient.get(`${API_URL}/Product/GetProducts`)
          let response = await lastValueFrom(httpCall)
          return response
        }

          //Get Inventory 4
      async GetInventory(): Promise<any> {
        let httpCall = this.httpClient.get(`${API_URL}/Inventory/GetAllInventoryItems`)
        let response = await lastValueFrom(httpCall)
        return response
      }
  
  //Post Supplier Orders (PLACED) 5
  async PostSupplierOrders(supplierOrder: any) {
    let httpCall = this.httpClient.post(`${API_URL}/SupplierOrder/PlaceSupplierOrder`, supplierOrder)
    let response = await lastValueFrom(httpCall)
    return response
    
  }

  //Get Product OrderLine 6
  async GetProductOrderLine(orderId: any){
    let httpCall = this.httpClient.get(`${API_URL}/SupplierOrder/GetProductOrderLines?SupplierOrderId=${orderId}`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Get Inventory OrderLine 7
  async GetInventoryOrderLine(orderId: any){
    let httpCall = this.httpClient.get(`${API_URL}/SupplierOrder/GetInventoryOrderLines?SupplierOrderId=${orderId}`)
    let response = await lastValueFrom(httpCall)
    return response
  }

   //Post Product OrderLine 8
   async PostProductOrderLine(productOrderLine: any) {
    let httpCall = this.httpClient.post(`${API_URL}/SupplierOrder/AddProductOrderLine`, productOrderLine)
    let response = await lastValueFrom(httpCall)
    return response
    
  }

   //Post Inventory OrderLine 9
   async PostInventoryOrderLine(inventoryOrderLine: any) {
    let httpCall = this.httpClient.post(`${API_URL}/SupplierOrder/AddInventoryOrderLine`, inventoryOrderLine)
    let response = await lastValueFrom(httpCall)
    return response
    
  }

  //Update Order Status( 10
  async UpdateOrderStatus(supplierOrderStatus: any, SupplierOrderId: number){
    let httpCall = this.httpClient.put(`${API_URL}/SupplierOrder/UpdateOrderStatus?supplierOrderID=${SupplierOrderId}`, supplierOrderStatus)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Update Supplier Order Cancelled( 11
    async CancelSupplierOrder(cancelledOrderStatus: any, SupplierOrderId: number){
      let httpCall = this.httpClient.put(`${API_URL}/SupplierOrder/CancelSupplierOrder?supplierOrderID=${SupplierOrderId}`, cancelledOrderStatus)
      let response = await lastValueFrom(httpCall)
      return response
    }  

    OrderInfo(order: any){
      this.orderInfo.push({ 
        id: order.supplierOrderId,
        supplierid: order.supplierId,
        amount: order.orderAmount,
        supplierOrderDatePlaced: order.supplierOrderDatePlaced,
        supplierOrderDateReceived: order.supplierOrderDateReceived,
        supplierOrderStatusid: order.supplierOrderStatusId,
        supplierOrderStatus: order.supplierOrderStatus,
        supplier: order.supplier
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
       return this.httpClient.get(`${API_URL}/SupplierOrder/GetSupplierOrders`)
        .subscribe(results => {
          this.orders = results;
        console.log(this.orders)
      let lastOrder = this.orders.slice(-1)
      this.orderId = lastOrder[0].SupplierOrderId + 1
      localStorage.setItem('orderId', this.orderId);
    })
  }
}