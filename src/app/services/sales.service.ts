import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Sale } from '../interface/sales-interface';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})

export class SalesService {

  salesData: Sale[] = []

  constructor(private http: HttpClient) { }

  //Get Sales
  async GetSales(): Promise<any> {
    let httpCall = this.http.get(`${API_URL}/Sale/GetAllSales`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Get Sale Status
  async GetSaleStatus(): Promise<any> {
    let httpCall = this.http.get(`${API_URL}/Sale/GetAllSaleStatus`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Capture Sales
  async PostSales(sales: any) {
    let httpCall = this.http.post(`${API_URL}/Sale/CaptureSale`, sales)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Edit Sale Status
  async UpdateSales(saleId: any, sales: any) {
    let httpCall = this.http.put(`${API_URL}/Sale/EditSaleStatus?saleId=${saleId}`, sales)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async GetProducts() {
    let httpCall = this.http.get(API_URL + `/Product/GetProducts`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async confirmOrderLine(orderline: any) {
    let httpCall = this.http.post(`${API_URL}/Sale/AddSaleLine`, orderline)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async getLastSale() {
    let httpCall = this.http.get(`${API_URL}/Sale/GetAllSales`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async getSaleLines(saleId: any){
    let httpCall = this.http.get(`${API_URL}/Sale/GetSaleLines?saleId=${saleId}`)
    let response = await lastValueFrom(httpCall)
    return response
 }

  //Passing Data Functions
  SalesData(sales: any) {
    this.salesData.push({
      saleId: sales.saleId,
      saleStatusId: sales.saleStatusId,
      saleStatusName: sales.saleStatus.saleStatusName,
      customerName: sales.customer.customerName + " " + sales.customer.customerSurname,
      saleAmount: sales.saleAmount,
      saleDate: sales.saleDate,
      saleReceipt: sales.saleReceipt,
    })
  }

  retrieveSaleData() {
    let retrieveSaleData = this.salesData
    return retrieveSaleData
  }

  clearData() {
    this.salesData = []
  }
}