import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  async CompileProductDashboard() {
    try {
			let httpCall = this.http.get<any>(API_URL + `/Dashboard/GetProductDashboard`);
			let results = (await lastValueFrom(httpCall));

			return results;
		} catch (error) {
      return console.log(error);
		}
  }

  async CompileSaleDashboard(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Dashboard/GetSaleDashboard`);
      let results = (await lastValueFrom(httpCall));

      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async ComplileCustomerDashboard(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Dashboard/GetCustomerDashboard`);
      let results = (await lastValueFrom(httpCall));

      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async ComplileRepairDashboard(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Dashboard/GetRepairDashboard`);
      let results = (await lastValueFrom(httpCall));

      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async CompileSupplierDashboard(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Supplier/GetAllSuppliers`);
      let results = (await lastValueFrom(httpCall));



      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async CompileInventoryDashboard(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Inventory/GetAllInventoryItems`);
      let results = (await lastValueFrom(httpCall));
      
      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async CompileProductPieChart(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Dashboard/GetProductPieChart`);
      let results = (await lastValueFrom(httpCall));

      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async CompileSalesByCustomer(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Sale/GetAllSales`);
      let results = (await lastValueFrom(httpCall));

      for(let i = 0; i < results.length; i++){
        for(let j = i + 1; j < results.length; j++){
          if(results[i].customerEmail == results[j].customerEmail){
            results[i].saleAmount += results[j].saleAmount;
            results.splice(j, 1);
          }
        }
      }
      return results;
    } catch (error) {
      return console.log(error);
    }
  }

  async CompileProductsByType(){
    try {
      let httpCall = this.http.get<any>(API_URL + `/Dashboard/GetProductPieChart`);
      let results = (await lastValueFrom(httpCall))[0];

      let totalQuantity = 0;
      for(let i = 0; i < results.length; i++){
        totalQuantity += results[i].productQuantity;
      }
      for(let i = 0; i < results.length; i++){
        results[i].percentage = (results[i].productQuantity / totalQuantity);
      }

      return results;
    } catch (error) {
      return console.log(error);
    }
  }
}
