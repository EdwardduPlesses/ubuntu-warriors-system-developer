import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddStocktakeComponent } from '../add-stocktake/add-stocktake.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddStocktakeProductComponent } from '../add-stocktake-product/add-stocktake-product.component';

const API_URL = environment.API_URL;

export interface StockTake {
  stocktakeID: number;
  stocktakeDate: string;
  stocktakeDesc: string

}
@Component({
  selector: 'app-stocktake',
  templateUrl: './stocktake.component.html',
  styleUrls: ['./stocktake.component.css']
})
export class StocktakeComponent implements OnInit {
  stocktakes: any = [];
  displayedColumns: string[] = ['stocktakeID', 'stocktakeDate', 'stocktakeDesc'];
  dataSource = new MatTableDataSource<StockTake>()
  constructor(public http: HttpClient, public dialog: MatDialog, public snackBarService: SnackbarService) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(){
    this.getStocktakes();
  }

  addStockTakeInventory() {
    this.dialog.open(AddStocktakeComponent, {disableClose: true})
    .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
  }

  addStockTakeProduct(){
    this.dialog.open(AddStocktakeProductComponent, {disableClose: true})
    .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStocktakes(){
    this.http.get(`${API_URL}/StockTake/GetAllStockTakes`)
    .subscribe(results => {
      this.stocktakes = results;
      this.dataSource.data = results as StockTake[];

    })
  }

}
