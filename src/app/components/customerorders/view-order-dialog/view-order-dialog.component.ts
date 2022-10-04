import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OrderInfoService } from '../../../services/order-info.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';

const API_URL = environment.API_URL;

@Component({
  selector: 'app-view-order-dialog',
  templateUrl: './view-order-dialog.component.html',
  styleUrls: ['./view-order-dialog.component.css']
})
export class ViewOrderDialogComponent implements OnInit {
  viewOrder!: FormGroup;
  orderInfo: any = []
  orderlines: any =[]
  name: any
  id: any

  constructor(public dialogRef: MatDialogRef<ViewOrderDialogComponent>, public orderInfoService: OrderInfoService, public http: HttpClient, public customerOrderService: CustomerOrderService) { }

  ngOnInit(){
    this.orderInfo = this.orderInfoService.retrieveOrderInfo();
      this.orderInfoService.clearData();
      this.getOrderLines()

    this.viewOrder = new FormGroup({
      orderId: new FormControl(`${this.orderInfo[0].id}`, [Validators.required]),
      customerName: new FormControl(`${this.orderInfo[0].customer.customerName}`, [Validators.required]),
      customerSurname: new FormControl(`${this.orderInfo[0].customer.customerSurname}`, [Validators.required]),
      orderAmount: new FormControl(`${this.orderInfo[0].amount}`, [Validators.required]),
      orderDateCollected: new FormControl(`${this.orderInfo[0].dateCollected}`, [Validators.required]),
      orderDatePlaced: new FormControl(`${this.orderInfo[0].datePlaced}`, [Validators.required]),
      orderStatus: new FormControl(`${this.orderInfo[0].orderStatus.customerOrderStatusName}`, [Validators.required])
    })
  }
  
  submit() {
    // empty stuff
    }

  onNoClick(): void {
    this.dialogRef.close()
  }

 async getOrderLines(){
  await this.customerOrderService.getOrderLines(this.orderInfo[0].id).then(
    (res) => {
      this.orderlines = res;
    })

}

}
