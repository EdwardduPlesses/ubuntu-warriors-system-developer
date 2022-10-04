import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productInfo: any = [];
  products: any;
  statusData: any = []
  constructor(private http: HttpClient) { }

  async getProducts() {
    try {
      let httpCall = this.http.get<any>(API_URL + `/Product/GetProducts`);
      let results = (await lastValueFrom(httpCall));

      this.products = results;
      return this.products;
    } catch (error) {
      return console.log(error);
    }
  }

  async updateProduct(product: any) {
    try {
      let httpCall = this.http.put<any>(API_URL + `/Product/UpdateProduct`, product.productId);
      let results = (await lastValueFrom(httpCall));

      return results;
    }
    catch (error) {
      return console.log(error);
    }

  }

  async CompileProductDashboard() {
    try {
      let httpCall = this.http.get<any>(API_URL + `/Dashboard/GetProductDashboard`);
      let results = (await lastValueFrom(httpCall));

      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  ProductInfo(product: any) {
    this.productInfo.push({
        productId: product.productId,
        productName: product.productName,
        productPrice: product.productPrice,
        productQuantity: product.productQuantity,
        productTypeId: product.productTypeId,
        productStatusId: product.productStatusId,
    })

  }

  async getProductTypes(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/ProductType/GetAllProductTypes`);
      let results = (await lastValueFrom(httpCall));

      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async getProductStatus(): Promise<any> {
    let httpCall = this.http.get(`${API_URL}/Product/GetAllProductStatus`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async UpdateProductStatus(productStatus: any) {
    let httpCall = this.http.put(`${API_URL}/Product/UpdateProductStatus?productStatusId=${productStatus.productStatusId}`, productStatus)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async retrieveproductInfo(){
    let retrievedproducInfo = this.productInfo;
    return retrievedproducInfo
  }

  StatusData(status: any) {
    this.statusData.push({
      productStatusId: status.productStatusId,
      productStatusName: status.productStatusName,
      quantity: status.quantity
  })
}

retrieveStatusData() {
    let retrievedStatusData = this.statusData
    return retrievedStatusData
  }

  clearData() {
    this.productInfo = [];
    this.statusData = [];
  }
}