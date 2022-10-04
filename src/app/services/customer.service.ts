import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../interface/customer-interface';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customerData: Customer[] = [];

  constructor(private httpClient: HttpClient) {}
    
  //Get Customers
  async GetCustomers(): Promise<any> {
    let httpCall = this.httpClient.get(`${API_URL}/Customer/GetAllCustomers`)
    let response = await lastValueFrom(httpCall)
    return response
  }
  
  //Post Customers
  async PostCustomer(customer: any) {
    let httpCall = this.httpClient.post(`${API_URL}/Customer/AddCustomer`, customer)
    let response = await lastValueFrom(httpCall)
    return response
    
  }

  //Get Titles
  async GetTitles(){
    let httpCall = this.httpClient.get(`${API_URL}/Customer/GetAllTitles`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Update CustomerData(
  async UpdateCustomer(customer: any, customerID: number){
    let httpCall = this.httpClient.put(`${API_URL}/Customer/UpdateCustomer?customerID=${customerID}`, customer)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Delete Customer
  async DeleteCustomer(customerID: number){
    let httpCall = this.httpClient.delete(`${API_URL}/Customer/DeleteCustomer?customerID=${customerID}`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Passing Data Functions
  CustomerData(customer: any) {
    this.customerData.push({
      CustomerId: customer.CustomerId,
      CustomerCompetencyId: customer.CustomerCompetencyId,
      customerCompetencyType: customer.customerCompetencyType,
      CustomerName: customer.CustomerName,
      CustomerSurname: customer.CustomerSurname,
      CustomerPhoneNo: customer.CustomerPhoneNo,
      CustomerEmail: customer.CustomerEmail,
      CustomerIdNumber: customer.CustomerIdNumber,
      AddressId: customer.AddressId,
      streetName: customer.streetName,
      streetNumber: customer.streetNumber,
      TitleId: customer.TitleId,
      titleDescr: customer.titleDescr
    });
    console.log(this.customerData)

  }

  retrieveCustomerData() {
    let retrievedCustomerData = this.customerData;
    return retrievedCustomerData;
  }

  clearData() {
    this.customerData = [];
  }
}