import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SupplierOrderService } from 'src/app/services/supplier-orders.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';



@Component({
  selector: 'app-receive-supplier-order-dialog',
  templateUrl: './receive-supplier-order-dialog.component.html',
  styleUrls: ['./receive-supplier-order-dialog.component.css']
})
export class ReceiveSupplierOrderDialogComponent implements OnInit {

  updateOrder!: FormGroup;
  orderInfo: any = []
  name: any
  statusId: any
  supplierId: any

  constructor(public dialogRef: MatDialogRef<ReceiveSupplierOrderDialogComponent>, public snackBarService: SnackbarService, public http: HttpClient, public supplierOrderService: SupplierOrderService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  ngOnInit(){
    this.orderInfo = this.supplierOrderService.retrieveOrderInfo();
      this.supplierOrderService.clearData();
      console.log(this.orderInfo);
    this.updateOrder = new FormGroup({
      orderAmount: new FormControl(`${this.orderInfo[0].amount}`, [Validators.required]),
      supplierOrderDateReceived: new FormControl(`${this.orderInfo[0].supplierOrderDateReceived}`, [Validators.required]),
      supplierOrderDatePlaced: new FormControl(`${this.orderInfo[0].supplierOrderDatePlaced}`, [Validators.required]),
      supplierOrderStatus: new FormControl(`${this.orderInfo[0].supplierOrderStatus.supplierOrderStatusName}`, [Validators.required])
    })
  }

  submit() {
    // empty stuff
    }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to update the order')
    this.dialogRef.close()
  }

  async confirmUpdate(): Promise<void> {
    if(this.updateOrder.valid){
      this.name = this.updateOrder.controls['supplierOrderStatus'].value
      if (this.name == 'Received')
      {
        this.statusId = 3

        let updatedOrder =
        {
         
          supplierOrderStatusId: this.statusId,
        };
        console.log(updatedOrder);
      await this.supplierOrderService.UpdateOrderStatus(updatedOrder, this.orderInfo[0].id).then(() =>{},
      (response: HttpErrorResponse) => {
       if(response.status == 200){
         this.snackBarService.setMessage(" Updated successfully")

         var today = new Date();
         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
         var dateTime = date+' '+time;
  
         let audit = 
         {
           auditDate: dateTime,
           auditDesc: this.authService.currentUser.userName + ' received Supplier Order ' + this.orderInfo[0].id,
           username: this.authService.currentUser.userName,
           transactionType: 'Update',
           entity: 'SupplierOrders'
         }
         this.customerOrderService.addAuditTrail(audit);
       }
       else{
         this.snackBarService.setMessage("Failed to update Order")
       }
      })


      }
      this.snackBarService.setMessage('The order was successfully updated')
      this.dialogRef.close();
    }
  }

}
