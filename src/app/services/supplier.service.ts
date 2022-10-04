import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Suppliers } from '../interface/supplier-interface';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  supplierData: Suppliers[] = []

  constructor(private httpClient: HttpClient) { }

  //Get Supplier
  async GetSupplier(): Promise<any> {
    let httpCall = this.httpClient.get(`${API_URL}/Supplier/GetAllSuppliers`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Post Supplier
  async PostSupplier(supplier: any) {
    let httpCall = this.httpClient.post(`${API_URL}/Supplier/AddSupplier`, supplier)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Update Supplier
  async UpdateSupplier(supplierId: any, supplier: any) {
    let httpCall = this.httpClient.put(`${API_URL}/Supplier/UpdateSupplier?supplierId=${supplierId}`, supplier)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Delete Supplier
  async DeleteSupplier(supplierId: any) {
    let httpCall = this.httpClient.delete(`${API_URL}/Supplier/DeleteSupplier?supplierId=${supplierId}`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Post Supplier
  async PostSupplierAddress(supplier: any) {
    let httpCall = this.httpClient.post(`${API_URL}/Supplier/AddAddress`, supplier)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Passing Data Functions
  SupplierData(supplier: any) {
    this.supplierData.push({
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      supplierPhoneNo: supplier.supplierPhoneNo,
      supplierEmail: supplier.supplierEmail,
      addressId: supplier.address,
      streetName: supplier.streetName,
      streetNumber: supplier.streetNumber,
    })
  }

  retrieveSupplierData() {
    let retrievedSupplierData = this.supplierData
    return retrievedSupplierData
  }

  clearData() {
    this.supplierData = [];
  }
}