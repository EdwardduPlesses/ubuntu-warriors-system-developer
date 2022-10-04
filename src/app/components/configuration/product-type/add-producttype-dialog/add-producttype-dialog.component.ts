import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL + "/ProductType";

@Component({
  selector: 'app-add-producttype-dialog',
  templateUrl: './add-producttype-dialog.component.html',
  styleUrls: ['./add-producttype-dialog.component.css'],
})

export class AddProducttypeDialogComponent implements OnInit {

  addProductTypeControl = new FormGroup({
    ProductTypeName: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  constructor(
    public dialogRef: MatDialogRef<AddProducttypeDialogComponent>,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
  ) { }

  ngOnInit(): void { }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to add the Product Type');
    this.dialogRef.close();
  }

  async confirmAddType() {
    try {
      let httpCall = this.http.post(`${API_URL}/AddProductType`, this.addProductTypeControl.value);
      let result = (await lastValueFrom(httpCall));
      console.log(result);
    }
    catch (error: any) {
      if (error.status == 200) {
        this.snackBarService.setMessage('The Product Type was successfully added')

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let audit =
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' added Product Type ' + this.addProductTypeControl.controls['ProductTypeName'].value,
          username: this.authService.currentUser.userName,
          transactionType: 'Add',
          entity: 'Product Types'
        }
        this.customerOrderService.addAuditTrail(audit);
      }
      else {
        console.log(error);
      }
    }
    this.dialogRef.close();
  }
  getErrorMessageName() {
    if (this.addProductTypeControl.controls['ProductTypeName'].hasError('required')) {
      return 'You must enter a valid type';
    }
    return this.addProductTypeControl.controls['ProductTypeName'].hasError('minlength') ? 'Minimum 2 characters' : '';
  }
}
