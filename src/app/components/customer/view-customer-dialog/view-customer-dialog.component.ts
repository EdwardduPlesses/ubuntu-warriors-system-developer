import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/interface/customer-interface';
import { CustomerService } from 'src/app/services/customer.service';
import { SnackbarService } from 'src/app/services/snackbar.service';


interface Titles {
  title: string;
  id: number;
}

@Component({
  selector: 'app-view-customer-dialog',
  templateUrl: './view-customer-dialog.component.html',
  styleUrls: ['./view-customer-dialog.component.css']
})
export class ViewCustomerDialogComponent implements OnInit {
  
  viewCustomerFormControl!: FormGroup
  customerData: Customer[] = [];
  selectedTitle !: string 
  titles: any = [];

  constructor(public dialogRef: MatDialogRef<ViewCustomerDialogComponent>, private customerService: CustomerService, public snackBarService: SnackbarService) {}

  onNoClick() {
    this.snackBarService.setMessage('View Closed')
    this.dialogRef.close();
  }

  getErrorMessage() {
    return this.viewCustomerFormControl.hasError('required')
      ? 'Required field'
      : '';
  }

  ngOnInit() {
    this.customerService.GetTitles().then(res =>{
      this.titles = res
    })
    //Getting Data from the PassDataService
    this.customerData = this.customerService.retrieveCustomerData();

    //Clearing the dataServiceArray
    this.customerService.clearData();

    this.viewCustomerFormControl = new FormGroup({
      Customer_Name: new FormControl(`${this.customerData[0].CustomerName}`, [Validators.required]),
      Customer_Surname: new FormControl(`${this.customerData[0].CustomerSurname}`, [Validators.required]),
      Title_ID: new FormControl(`${this.customerData[0].titleDescr}`, [Validators.required]),
      Address_ID: new FormControl(`${this.customerData[0].streetNumber} ${this.customerData[0].streetName}`, [Validators.required]),
      Customer_IDNumber: new FormControl(`${this.customerData[0].CustomerIdNumber}`, [Validators.required]),
      Customer_PhoneNo: new FormControl(`${this.customerData[0].CustomerPhoneNo}`, [Validators.required]),
      CustomerCompetencyType: new FormControl(`${this.customerData[0].customerCompetencyType}`, [Validators.required]),
      Customer_Email: new FormControl(`${this.customerData[0].CustomerEmail}`, [Validators.required])
    })
  }

}
