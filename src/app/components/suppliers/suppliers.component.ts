import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddSupplierDialogComponent } from './add-supplier-dialog/add-supplier-dialog.component';
import { DeleteSupplierDialogComponent } from './delete-supplier-dialog/delete-supplier-dialog.component';
import { Suppliers } from '../../interface/supplier-interface';
import { SupplierService } from '../../services/supplier.service';
import { UpdateSupplierDialogComponent } from './update-supplier-dialog/update-supplier-dialog.component';
import { ViewSupplierDialogComponent } from './view-supplier-dialog/view-supplier-dialog.component';
import { MatSort } from '@angular/material/sort';
import { SuppliersHelpComponent } from '../help/suppliers-help/suppliers-help.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  displayedColumns: string[] = ['supplierName', 'supplierPhone', 'supplierEmail', 'supplierAddress', 'actions'];

  dataSource = new MatTableDataSource<Suppliers>()
  isLoading : boolean = false;

  actionsClicked: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, public http: HttpClient, public service: SupplierService, public snackbar: SnackbarService) { }

  async ngOnInit() {
    await this.refresh();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addSupplier() {
    this.dialog.open(AddSupplierDialogComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() });
  }

  deleteSupplier(supplierId: number) {
    this.service.SupplierData(supplierId)
    this.dialog.open(DeleteSupplierDialogComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() });
  }

  updateSupplier(supplierId: number) {
    this.service.SupplierData(supplierId)
    this.dialog.open(UpdateSupplierDialogComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() });
  }

  viewSupplier(supplierId: number) {
    if (this.actionsClicked == false) {
      this.service.SupplierData(supplierId)
      this.dialog.open(ViewSupplierDialogComponent, { disableClose: true })
        .afterClosed().subscribe(async () => await this.refresh());
    }
    this.actionsClicked = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async refresh() {
    this.isLoading = true;
    await this.service.GetSupplier().then(
      (res) => {
        this.dataSource.data = res;
        console.log('Supp', this.dataSource.data)
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('Error getting suppliers');
        }
      }
    ).finally(() => this.isLoading = false);
  }

  onActionsClick() {
    this.actionsClicked = true;
  }

  openSuppliersHelp()
  {
    this.dialog.open(SuppliersHelpComponent, {disableClose: true})
  }
}