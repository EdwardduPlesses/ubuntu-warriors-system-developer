import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { ProductTypeInfoService } from '../../../../services/product-type-info.service';

const API_URL = environment.API_URL + "/ProductType";


@Component({
  selector: 'app-edit-producttype-dialog',
  templateUrl: './edit-producttype-dialog.component.html',
  styleUrls: ['./edit-producttype-dialog.component.css']
})
export class EditProducttypeDialogComponent implements OnInit {

  productTypeInfo: any = []
  productTVM: any = []
  updateProductTypeControl!: FormGroup

  constructor(public dialogRef: MatDialogRef<EditProducttypeDialogComponent>,
    public productTypeInfoService: ProductTypeInfoService,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public fb: FormBuilder,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService) { }

  ngOnInit(): void {
    //Get product from pass service
    this.productTypeInfo = this.productTypeInfoService.retrieveUserTypeInfo();

    //Clear array from pass service
    this.productTypeInfoService.clearData();

    this.updateProductTypeControl = new FormGroup({
      productTypeName: new FormControl(`${this.productTypeInfo[0].name}`, Validators.required)
    });
  }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to update the Product Type');
    this.dialogRef.close();
  }

  async confirmUpdateType() {
    try
    {
      let httpCall = this.http.put(`${API_URL}/UpdateProductType?productTypeID=${this.productTypeInfo[0].ID}`, this.updateProductTypeControl.value);
      let result = (await lastValueFrom(httpCall));
      console.log(result);
  }
  catch(error: any)
  {
    if(error.status == 200)
    {
      this.snackBarService.setMessage('The Product Type was successfully updated');

      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      let audit = 
      {
        auditDate: dateTime,
        auditDesc: this.authService.currentUser.userName + ' updated Product Type ' + this.updateProductTypeControl.controls['productTypeName'].value,
        username: this.authService.currentUser.userName,
        transactionType: 'Update',
        entity: 'Product Types'
      }
      this.customerOrderService.addAuditTrail(audit);
    }
    else{
      console.log(error);
    }
  }
  this.dialogRef.close();
  
}
getErrorMessageName() {
  if (this.updateProductTypeControl.controls['productTypeName'].hasError('required')) {
    return 'You must enter a valid type';
  }
  return '';
}
}
