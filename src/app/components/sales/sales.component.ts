import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Sale } from '../../interface/sales-interface';
import { SalesService } from '../../services/sales.service';
import { ViewSaleComponent } from './view-sale/view-sale.component';
import { CaptureSaleComponent } from './capture-sale/capture-sale.component';
import { MatSort } from '@angular/material/sort';
import { EditSaleComponent } from './edit-sale/edit-sale.component';
import { SalesHelpComponent } from '../help/sales-help/sales-help.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})

export class SalesComponent implements OnInit {

  displayedColumns: string[] = ['SaleDate', 'CustomerId', 'SaleStatusId', 'SaleAmount', 'SaleReceipt', 'Actions'];

  dataSource = new MatTableDataSource<Sale>()
  isLoading: boolean = false;

  actionsClicked: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, public http: HttpClient, public service: SalesService, public snackbar: SnackbarService) { }

  async ngOnInit() {
    await this.refresh();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  captureSale() {
    this.dialog.open(CaptureSaleComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() });
  }

  editSale(sales: any) {
    if (sales.saleStatusId == 3) {
      this.snackbar.setMessage("Sale has already been refunded")
      this.snackbar.openSnackBar()
    }
    else {
      this.service.SalesData(sales)
      this.dialog.open(EditSaleComponent, { disableClose: true })
        .afterClosed().subscribe(async () => { await this.refresh() });
    }
  }

  viewSaleStatus(sales: any) {
    if (this.actionsClicked == false) {
      this.service.SalesData(sales)
      this.dialog.open(ViewSaleComponent, { disableClose: true })
        .afterClosed().subscribe(async () => { await this.refresh() });
    }
    this.actionsClicked = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async refresh() {
    this.isLoading = true;
    await this.service.GetSales().then(
      (res) => { this.dataSource.data = res; },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('Error getting sales');
        }
      }).finally(() => this.isLoading = false);
  }

  onActionsClick() {
    this.actionsClicked = true;
  }

  openSalesHelp()
  {
    this.dialog.open(SalesHelpComponent, {disableClose: true})
  }
}