import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { OrderInfoService } from '../../../services/order-info.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-order-dialog',
  templateUrl: './update-order-dialog.component.html',
  styleUrls: ['./update-order-dialog.component.css']
})
export class UpdateOrderDialogComponent implements OnInit {
  updateOrder!: FormGroup;
  orderInfo: any = []
  name: any
  statusId: any
  customerId: any
  orderStatus: any


  constructor(public dialogRef: MatDialogRef<UpdateOrderDialogComponent>, public snackBarService: SnackbarService, public http: HttpClient, public orderInfoService: OrderInfoService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  ngOnInit() {
    this.orderInfo = this.orderInfoService.retrieveOrderInfo();
    this.orderInfoService.clearData();
    this.updateOrder = new FormGroup({
      orderAmount: new FormControl(`${this.orderInfo[0].amount}`, [Validators.required]),
      orderDateCollected: new FormControl(`${this.orderInfo[0].dateCollected}`, [Validators.required]),
      orderDatePlaced: new FormControl(`${this.orderInfo[0].datePlaced}`, [Validators.required]),
      orderStatus: new FormControl(`${this.orderInfo[0].orderStatus.customerOrderStatusName}`, [Validators.required])
    })
    this.orderStatus = this.orderInfo[0].orderStatus.customerOrderStatusName
  }

  submit() {
    // empty stuff
  }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to update the order')
    this.dialogRef.close()
  }

  async confirmUpdate(){
    if(this.updateOrder.valid){
      this.name = this.updateOrder.controls['orderStatus'].value

      if (this.name == 'Ready For Collection')
      {

        this.statusId = 2
        this.customerId = this.orderInfo[0].customerid

        let updatedOrder =
        {
          customerId: this.customerId,
          customerOrderStatusId: this.statusId,
        };

        console.log(updatedOrder);

        await this.customerOrderService.collectOrder(this.orderInfo[0].id, updatedOrder).then(() =>{},
        (response: HttpErrorResponse) => {
          if(response.status == 200){
            this.snackBarService.setMessage("Order Status successfully updated")

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;

            let audit = 
            {
              auditDate: dateTime,
              auditDesc: this.authService.currentUser.userName + ' updated Customer Order ' + this.orderInfo[0].id + "'s status",
              username: this.authService.currentUser.userName,
              transactionType: 'Update',
              entity: 'CustomerOrder',
            }
            this.customerOrderService.addAuditTrail(audit)
          }
          else{
            this.snackBarService.setMessage("Failed to update Order Status")
          }
        })
      }
      else if (this.name == 'Cancelled') {
        this.statusId = 4
      }

      let updatedOrder =
{
    customerOrderStatusId: this.statusId,
};

console.log(updatedOrder);

await this.customerOrderService.updateOrderStatus(this.orderInfo[0].id, updatedOrder).then(() =>{},
(response: HttpErrorResponse) => {
  if(response.status == 200){
    this.snackBarService.setMessage("Order Status successfully updated")

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;

            let audit = 
            {
              auditDate: dateTime,
              auditDesc: this.authService.currentUser.userName + ' updated Customer Order ' + this.orderInfo[0].id + "'s status",
              username: this.authService.currentUser.userName,
              transactionType: 'Update',
              entity: 'CustomerOrder'
            }
            this.customerOrderService.addAuditTrail(audit);
  }
  else{
    this.snackBarService.setMessage("Failed to update Order Status")
  }
})
    }
    this.dialogRef.close()
  }

}
