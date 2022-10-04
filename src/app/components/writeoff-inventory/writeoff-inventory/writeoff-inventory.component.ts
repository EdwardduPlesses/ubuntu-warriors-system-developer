import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddWriteoffComponent } from '../add-writeoff/add-writeoff.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddWriteoffProductComponent } from '../add-writeoff-product/add-writeoff-product.component';

const API_URL = environment.API_URL;

export interface writeoffInventory {
  writeoffID: number;
  writeoffDate: string;
  writeoffDesc: string

}

@Component({
  selector: 'app-writeoff-inventory',
  templateUrl: './writeoff-inventory.component.html',
  styleUrls: ['./writeoff-inventory.component.css']
})
export class WriteoffInventoryComponent implements OnInit {
  writeoffs: any = [];
  displayedColumns: string[] = ['writeoffID', 'writeoffDate', 'writeoffDesc'];
  dataSource = new MatTableDataSource<writeoffInventory>()
  constructor(public http: HttpClient, public dialog: MatDialog, public snackBarService: SnackbarService) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(){
    this.getWriteoffs();
  }

  addWriteOffInventory() {
    this.dialog.open(AddWriteoffComponent, {disableClose: true})
    .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
  }

  addWriteOffProduct(){
    this.dialog.open(AddWriteoffProductComponent, {disableClose: true})
    .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getWriteoffs(){
    this.http.get(`${API_URL}/WriteOff/GetAllWriteOffs`)
    .subscribe(results => {
      this.writeoffs = results;
      this.dataSource.data = results as writeoffInventory[];
    })
  }

}
