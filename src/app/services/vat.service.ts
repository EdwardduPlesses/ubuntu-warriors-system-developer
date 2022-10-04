import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;
@Injectable({
  providedIn: 'root'
})
export class VatService {


  headers = new HttpHeaders().set('Content-Type', 'application/json');

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json;'
    })
  }

  constructor(private http: HttpClient, public router: Router, private snackBar: MatSnackBar) { }

  async getCurrentVatRate(){
    try{
      let httpCall = this.http.get<any>(`${API_URL}/Static/GetCurrentVATRate`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));
      console.log('VAT RATES', result);
      return result;
    }
    catch(error: any){
      console.log(error);
    }
  }
  
  async getVatRates(){
    try{
      let httpCall = this.http.get<any>(`${API_URL}/Static/GetVATRates`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));
      console.log('VAT RATES', result);
      return result;
    }
    catch(error: any){
      console.log(error);
    }
  }

  async addVATRate(vatRate: number){
    try{
      let httpCall = this.http.post<any>(`${API_URL}/Static/AddVATRate?vatRate=${vatRate}`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));
      console.log('VAT RATES', result);
      return result;
    }
    catch(error: any){
      console.log(error);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {duration: 3000});
  }
}
