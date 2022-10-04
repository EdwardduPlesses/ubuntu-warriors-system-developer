import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';

@Component({
  selector: 'app-update-product-status',
  templateUrl: './update-product-status.component.html',
  styleUrls: ['./update-product-status.component.css']
})
export class UpdateProductStatusComponent implements OnInit {
  updateStatusForm!: FormGroup;
  statusData: any = []
  constructor(public dialogRef: MatDialogRef<UpdateProductStatusComponent>, public http: HttpClient, private snackbar: SnackbarService, public productService: ProductService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async ngOnInit() {
    this.statusData = this.productService.retrieveStatusData();
    this.productService.clearData();

    this.updateStatusForm = new FormGroup({
      productStatusId: new FormControl(`${this.statusData[0].productStatusId}`, [Validators.required]),
      productStatusName: new FormControl(`${this.statusData[0].productStatusName}`, [Validators.required]),
      quantity: new FormControl(`${this.statusData[0].quantity}`, [Validators.required,Validators.min(0),]),
  });
}

async confirmUpdate() {
  await this.productService.UpdateProductStatus(this.updateStatusForm.value).then(() => { },
    (response: HttpErrorResponse) => {
      if (response.status == 200) {
        this.snackbar.setMessage("Product Status Edited Successfully")

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        let audit = 
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' updated ' + this.updateStatusForm.value.productStatusName+ 's quantity',
          username: this.authService.currentUser.userName,
          transactionType: 'Update',
          entity: 'Product Status'
        }
        this.customerOrderService.addAuditTrail(audit);
      }
      else {
        this.snackbar.setMessage("Failed to Edit Product Status")
      }
    })
  this.dialogRef.close();
}

onNoClick(){
  this.snackbar.setMessage('You chose not to edit the status');

  this.dialogRef.close();
}
}
