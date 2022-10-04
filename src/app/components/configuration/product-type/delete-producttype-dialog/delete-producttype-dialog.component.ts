import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { ProductTypeInfoService } from '../../../../services/product-type-info.service';

const API_URL = environment.API_URL + '/ProductType';

@Component({
  selector: 'app-delete-producttype-dialog',
  templateUrl: './delete-producttype-dialog.component.html',
  styleUrls: ['./delete-producttype-dialog.component.css'],
})
export class DeleteProducttypeDialogComponent implements OnInit {
  productTypeInfo: any = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteProducttypeDialogComponent>,
    public productTypeInfoService: ProductTypeInfoService,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    //Get product from pass service
    this.productTypeInfo = this.productTypeInfoService.retrieveUserTypeInfo();

    //Clear array from pass service
    this.productTypeInfoService.clearData();
  }

  onNoClick() {
    this.snackBarService.setMessage('You chose not to delete the Product Type');
    this.dialogRef.close();
  }

  async confirmDeleteType(productType: any) {
    try
    {
      let httpCall = this.http.delete(`${API_URL}/DeleteProductType?productTypeID=${productType.ID.toString()}`);
      let result = (await lastValueFrom(httpCall));
      console.log(result);
  }
  catch(error: any)
  {
    if(error.status == 200)
    {
      this.snackBarService.setMessage('The product type was successfully deleted');

      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      let audit = 
      {
        auditDate: dateTime,
        auditDesc: this.authService.currentUser.userName + ' deleted Product Type ' + productType.name,
        username: this.authService.currentUser.userName,
        transactionType: 'Delete',
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
}
