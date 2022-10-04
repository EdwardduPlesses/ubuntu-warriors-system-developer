import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddOrderDialogComponent } from './add-order-dialog/add-order-dialog.component';
import { UpdateOrderDialogComponent } from './update-order-dialog/update-order-dialog.component';
import { ViewOrderDialogComponent } from './view-order-dialog/view-order-dialog.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { OrderInfoService } from '../../services/order-info.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerordersHelpComponent } from '../help/customerorders-help/customerorders-help.component';

export interface CustomerOrder {
  orderID: number;
  orderAmount: number;
  orderDatePlaced: string;
  orderDateCollected: string;
  orderStatus: string;
}

@Component({
  selector: 'app-customerorders',
  templateUrl: './customerorders.component.html',
  styleUrls: ['./customerorders.component.css']
})
export class CustomerordersComponent implements AfterViewInit {
  orders: any = [];
  displayedColumns: string[] = ['orderID', 'customer', 'orderAmount', 'orderStatus', 'actions'];
  dataSource = new MatTableDataSource<CustomerOrder>()
  constructor(
    public http: HttpClient, 
    public dialog: MatDialog, 
    public snackBarService: SnackbarService, 
    public orderInfoService: OrderInfoService, 
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
    ) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit(){
    await this.getOrders();
  }

   addOrder() {

    this.dialog.open(AddOrderDialogComponent, {disableClose: true})
    .afterClosed()
      .subscribe(async () => {
        this.snackBarService.openSnackBar(), await this.getOrders();
      });
  }

  completedOrder: any =
  {
    orderDateCollected: new Date(Date.now()),
      customerOrderStatusId: 3,
  };

async completeOrder(order: any){
  if(order.customerOrderStatus.customerOrderStatusId == 4 || order.customerOrderStatus.customerOrderStatusId == 3)
  {
    this.snackBarService.setMessage("Order has already been cancelled or completed")
    this.snackBarService.openSnackBar()
  }
  else
  {
    await this.customerOrderService.completeOrder(order, this.completedOrder).then(() =>{},
    (response: HttpErrorResponse) => {
      if(response.status == 200){
        this.snackBarService.setMessage("Order has been completed")
  
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
  
        let audit = 
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' completed Customer Order ' + order.customerOrderId,
          username: this.authService.currentUser.userName,
          transactionType: 'Update',
          entity: 'CustomerOrder'
        }
        this.customerOrderService.addAuditTrail(audit);
      }
      else{
        this.snackBarService.setMessage("Failed to complete order")
      }
    }).then(async () => {
      this.snackBarService.openSnackBar(), await this.getOrders();
    });
  }

}

  viewOrder(order: any) {
    this.orderInfoService.OrderInfo(order)
    this.dialog.open(ViewOrderDialogComponent, {disableClose: true})
  }

  updateOrder(order: any) {
    if(order.customerOrderStatus.customerOrderStatusId == 4 || order.customerOrderStatus.customerOrderStatusId == 3)
    {
        this.snackBarService.setMessage("Order has already been cancelled or completed")
    this.snackBarService.openSnackBar()
    }
    else
    {
      this.orderInfoService.OrderInfo(order)

      this.dialog.open(UpdateOrderDialogComponent, {disableClose: true})
      .afterClosed()
        .subscribe(async () => {
          this.snackBarService.openSnackBar(), await this.getOrders();
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getOrders(){
    await this.customerOrderService.getOrders().then(
      (res) => {
        this.dataSource.data = res;
        this.orders = res;
        console.log(this.orders)
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackBarService.setMessage('error getting orders');
        }
      }
    );
  }

  openCustomerOrdersHelp()
  {
    this.dialog.open(CustomerordersHelpComponent, {disableClose: true})
  }

}
