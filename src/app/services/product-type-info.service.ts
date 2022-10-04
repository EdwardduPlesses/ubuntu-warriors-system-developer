import {Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeInfoService {

  constructor() { }

  productTypeInfo: any = []
  ProductTypeInfo(productType: any) {
    
    this.productTypeInfo.push({
      name: productType.productTypeName,
      ID: productType.productTypeId
    })

  }

  retrieveUserTypeInfo(){
    return this.productTypeInfo
  }

  clearData(){
    this.productTypeInfo = [];
  }
}
