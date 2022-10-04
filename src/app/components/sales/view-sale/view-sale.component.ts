import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer.service';
import { SalesService } from 'src/app/services/sales.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['./view-sale.component.css']
})
export class ViewSaleComponent implements OnInit {

  salesData: any = [];
  customers: any = [];
  orderlines: any = [];

  constructor(public dialog: MatDialogRef<ViewSaleComponent>, public snackbar: SnackbarService, public sservice: SalesService, public cservice: CustomerService) { }

  async ngOnInit() {
    this.salesData = await this.sservice.retrieveSaleData();
    this.sservice.clearData();

    this.getSaleLines();
  }

  onNoClick() {
    this.dialog.close()
  }

  async getCustomers() {
    await this.cservice.GetCustomers().then(Response => { this.customers = Response });
  }

  async getSaleLines() {
    await this.sservice.getSaleLines(this.salesData[0].saleId).then(
      (res) => { this.orderlines = res; })
  }
}