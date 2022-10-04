import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddInventoryItemComponent } from './add-inventory-item/add-inventory-item.component';
import { DeleteInventoryItemComponent } from './delete-inventory-item/delete-inventory-item.component';
import { Inventory } from '../../interface/inventory-interface';
import { InventoryService } from '../../services/inventory.service';
import { UpdateInventoryItemComponent } from './update-inventory-item/update-inventory-item.component';
import { MatSort } from '@angular/material/sort';
import { ViewInventoryItemComponent } from './view-inventory-item/view-inventory-item.component';
import { InventoryHelpComponent } from '../help/inventory-help/inventory-help.component';

@Component({
  selector: 'app-inventory',
  styleUrls: ['./inventory.component.css'],
  templateUrl: './inventory.component.html',
  template: `
  <mat-toolbar color="primary">`
})

export class InventoryComponent implements OnInit {

  displayedColumns: string[] = ['ItemName', 'Status', 'ItemDescription', 'ItemQuantity', 'ItemPrice', 'Actions'];

  dataSource = new MatTableDataSource<Inventory>()

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, public http: HttpClient, public service: InventoryService, public snackbar: SnackbarService) { }

  async ngOnInit() {
    await this.refresh()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addInventoryItem() {
    this.dialog.open(AddInventoryItemComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() })
  }

  updateInventory(inventory: any) {
    this.service.InventoryData(inventory)
    this.dialog.open(UpdateInventoryItemComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() });
  }

  deleteInventory(inventory: any) {
    this.service.InventoryData(inventory)
    this.dialog.open(DeleteInventoryItemComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() });
  }

  viewInventory(inventory: any) {
    this.service.InventoryData(inventory)
    this.dialog.open(ViewInventoryItemComponent, { disableClose: true })
      .afterClosed().subscribe(async () => { await this.refresh() });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async refresh() {
    this.isLoading = true;
    await this.service.GetInventory().then(
      (res) => { this.dataSource.data = res; },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('Error getting inventory');
        }
      }).finally( () => this.isLoading = false);
  }
  
  openInventoryHelp()
  {
    this.dialog.open(InventoryHelpComponent, {disableClose: true})
  }
}