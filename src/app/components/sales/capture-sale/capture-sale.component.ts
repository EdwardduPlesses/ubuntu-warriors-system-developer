import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SalesService } from 'src/app/services/sales.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-capture-sale',
  templateUrl: './capture-sale.component.html',
  styleUrls: ['./capture-sale.component.css']
})
export class CaptureSaleComponent implements OnInit {

  customers: any = [];
  sales: any = [];
  saleStatus: any = [];
  currentBasket: any = [];
  basketItem: any = [];
  products: any = [];
  orderLines: any = [];
  orders: any = [];
  saleAmount: number = 0;

  addOrderLine!: FormGroup;
  captureSale!: FormGroup;

  constructor(public dialog: MatDialogRef<CaptureSaleComponent>, public http: HttpClient, public snackbar: SnackbarService, public saleService: SalesService, public customerService: CustomerService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async ngOnInit() {

    this.getCustomers();
    this.GetProducts();
    this.GetSaleStatus();
    this.getLastSale();
    this.refresh();

    let yourDate = new Date()
    let formatDate = yourDate.toISOString().split('T')[0]

    this.captureSale = new FormGroup({
      customerId: new FormControl('', [Validators.required]),
      saleStatusId: new FormControl('', [Validators.required]),
      saleAmount: new FormControl('', [Validators.required]),
      saleDate: new FormControl('', [Validators.required]),
      saleReceipt: new FormControl('', [Validators.required])
    })

    this.captureSale.controls['saleDate'].setValue(formatDate)

    this.addOrderLine = new FormGroup({
      saleId: new FormControl('', [Validators.required]),
      productId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    })
  }

  onNoClick() {
    this.snackbar.setMessage("You chose not to capture a new sale.")
    this.dialog.close()
  }

  saveOrderLine() {
    this.products.forEach((product: any) => {
      if (this.addOrderLine.controls['productId'].value == product.productId) {
        if (this.addOrderLine.controls['quantity'].value <= product.productQuantity) {
          this.saleAmount += product.productPrice * this.addOrderLine.controls['quantity'].value
          this.captureSale.controls['saleAmount'].setValue(this.saleAmount)
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
        else {
          this.snackbar.setMessage('The quantity selected is greater than the stock on hand')
          this.snackbar.openSnackBar()
        }
      }
    })
  }

  undoOrderLine() {
    this.orderLines.pop()
    let removedItem = this.currentBasket.pop()

    this.saleAmount -= removedItem.productPrice * removedItem.quantity
    if (this.saleAmount == 0) {
      this.captureSale.controls['orderAmount'].setValue(null)
    }
    else {
      this.captureSale.controls['orderAmount'].setValue(this.saleAmount)
    }
  }

  async confirmCaptureSale() {
    await this.saleService.PostSales(this.captureSale.value)
    .catch((error: HttpErrorResponse) => {
      this.snackbar.setMessage(error.error.text || error.error);
    }).finally(() => {this.snackbar.openSnackBar(); this.dialog.close();})
  }

  async GetProducts() {
    await this.saleService.GetProducts().then(
      (res) => {
        this.products = res;
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('error getting orders');
        }
      }
    );
  }

  async getLastSale() {
    await this.saleService.getLastSale().then((res) => {
      this.sales = res;
      let lastOrder = this.sales.slice(-1)
      if (lastOrder != null) {
        this.addOrderLine.controls['saleId'].setValue(lastOrder[0].saleId + 1)
      }
      else {
        this.addOrderLine.controls['saleId'].setValue(0)
      }
    },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('error getting orders');
        }
      }
    );
  }

  async confirmOrderLine() {
    if (this.addOrderLine.valid) {
      this.orderLines.forEach(async (orderLine: any) => {
        await this.saleService.confirmOrderLine(orderLine).then(() => { },
          (response: HttpErrorResponse) => {
            if (response.status == 200) {
              this.snackbar.setMessage("orderLine added")

              var today = new Date();
              var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
              var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
              var dateTime = date + ' ' + time;

              let audit =
              {
                auditDate: dateTime,
                auditDesc: this.authService.currentUser.userName + ' captured Sale' + ' ' + this.addOrderLine.value.saleId,
                username: this.authService.currentUser.userName,
                transactionType: 'Add',
                entity: 'Sales'
              }
              this.customerOrderService.addAuditTrail(audit);
            }
            else {
              this.snackbar.setMessage("Failed to add orderLine")
            }
          })
      })
    }
  }

  async refresh() {
    await this.saleService.GetSales().then(
      (res) => { this.sales = res; },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('Error getting sales');
        }
      });
  }


  async getCustomers() {
    await this.customerService.GetCustomers().then(Response => { this.customers = Response });
  }

  async GetSaleStatus() {
    await this.saleService.GetSaleStatus().then(Response => { this.saleStatus = Response; this.saleStatus.pop() });
  }
}