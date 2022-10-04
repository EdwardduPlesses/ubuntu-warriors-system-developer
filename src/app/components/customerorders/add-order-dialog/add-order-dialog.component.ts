import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrderInfoService } from '../../../services/order-info.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-order-dialog',
  templateUrl: './add-order-dialog.component.html',
  styleUrls: ['./add-order-dialog.component.css']
})
export class AddOrderDialogComponent implements OnInit {
  addOrder!: FormGroup;
  addOrderLine!: FormGroup;
  customers: any = [];
  products: any = [];
  orderLines: any = [];
  orders: any = [];
  orderAmount: number = 0;
  currentBasket: any = [];
  basketItem: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddOrderDialogComponent>, 
    public snackBarService: SnackbarService, 
    public http: HttpClient, 
    public orderInfoService: OrderInfoService,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
    ) { }

  ngOnInit() {
    let yourDate = new Date()
    let formatDate = yourDate.toISOString().split('T')[0]

    this.GetCustomers()
    this.GetProducts();
    this.getLastOrder()

    this.addOrder = new FormGroup({
      customerId: new FormControl('', [Validators.required]),
      customerOrderStatusId: new FormControl(1, [Validators.required]),
      orderAmount: new FormControl('', [Validators.required]),
      orderDatePlaced: new FormControl('', [Validators.required]),
    })

    this.addOrderLine = new FormGroup({
      customerOrderId: new FormControl('', [Validators.required]),
      productId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    })

    this.addOrder.controls['orderDatePlaced'].setValue(formatDate)
  }

    saveOrderLine(){
      this.products.forEach((product: any) => {
        if(this.addOrderLine.controls['productId'].value == product.productId) 
        {
          if(this.addOrderLine.controls['quantity'].value <= product.productQuantity)
          {
            this.orderAmount += product.productPrice * this.addOrderLine.controls['quantity'].value
            this.addOrder.controls['orderAmount'].setValue(this.orderAmount)
            this.orderLines.push(this.addOrderLine.value)

            this.basketItem = 
            {
              productName: product.productName,
              productPrice: product.productPrice, 
              quantity: this.addOrderLine.value.quantity,
            }
            this.currentBasket.push(this.basketItem)
            console.log(this.basketItem)
            console.log(this.currentBasket)
          }
          else
          {
            this.snackBarService.setMessage('The quantity selected is greater than the stock on hand')
            this.snackBarService.openSnackBar()
          }
        }
      })
  }

undoOrderLine(){
  this.orderLines.pop()
  let removedItem = this.currentBasket.pop()
  console.log(removedItem)

  this.orderAmount -= removedItem.productPrice * removedItem.quantity
  if(this.orderAmount == 0)
  {
    this.addOrder.controls['orderAmount'].setValue(null)
  }
  else
  {
    this.addOrder.controls['orderAmount'].setValue(this.orderAmount)
  }
}

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to add an order')
    this.dialogRef.close()
  }

  async confirmAdd(){
    this.customerOrderService.progressBar = true

    if(this.addOrder.valid){
      await this.customerOrderService.confirmAdd(this.addOrder.value).then(async () =>{},
  async (response: HttpErrorResponse) => {
    if(response.status == 200){
      this.snackBarService.setMessage("Order has been completed")
      await this.confirmOrderLine();

      var today = new Date();
         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
         var dateTime = date+' '+time;
  
         let audit = 
         {
           auditDate: dateTime,
           auditDesc: this.authService.currentUser.userName + ' placed Supplier Order ' + this.addOrderLine.controls['supplierOrderId'].value,
           username: this.authService.currentUser.userName,
           transactionType: 'Add',
           entity: 'SupplierOrders'
         }
         this.customerOrderService.addAuditTrail(audit);
    }
    else{
      this.snackBarService.setMessage("Failed to complete order")
    }
  })
  }
  this.dialogRef.close();
  }

  async confirmOrderLine(){
    if(this.addOrderLine.valid){
      this.orderLines.forEach(async (orderline: any) => {
        await this.customerOrderService.confirmOrderLine(orderline).then(() =>{},
    (response: HttpErrorResponse) => {
      if(response.status == 200){ 
        this.snackBarService.setMessage("Order added successfully")
        this.customerOrderService.progressBar = false
        var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      let audit = 
      {
        auditDate: dateTime,
        auditDesc: this.authService.currentUser.userName + ' added Customer Order ' + this.addOrderLine.controls['customerOrderId'].value,
        username: this.authService.currentUser.userName,
        transactionType: 'Add',
        entity: 'CustomerOrder'
      }
      this.customerOrderService.addAuditTrail(audit);
      }
      else{
        this.snackBarService.setMessage("Failed to add Orderline")
      }
    })
    })
    }
    this.dialogRef.close();
  }
  async getLastOrder(){
    await this.customerOrderService.getLastOrder().then(
      (res) => {
        this.orders = res;
        let lastOrder = this.orders.slice(-1)
   if (lastOrder != null)
   {
    this.addOrderLine.controls['customerOrderId'].setValue(lastOrder[0].customerOrderId + 1)
   }
   else
   {
   this.addOrderLine.controls['customerOrderId'].setValue(0)
   }
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackBarService.setMessage('error getting orders');
        }
      }
    );
    }

  async GetCustomers(){
    await this.customerOrderService.GetCustomers().then(
      (res) => {
        this.customers = res;
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackBarService.setMessage('error getting orders');
        }
      }
    );
  }
async GetProducts(){
  await this.customerOrderService.GetProducts().then(
    (res) => {
      this.products = res;
    },
    (response: HttpErrorResponse) => {
      if (response.status == 500) {
        this.snackBarService.setMessage('error getting orders');
      }
    }
  );
}


}
