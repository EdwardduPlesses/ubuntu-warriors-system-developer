import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatSort } from '@angular/material/sort';
import { InventoryService } from 'src/app/services/inventory.service';
import { UpdateInventoryStatusComponent } from '../update-inventory-status/update-inventory-status.component';

export interface InventoryStatus {
  inventoryStatusId: number;
  inventoryStatusName: string;
  quantity: number;
}

@Component({
  selector: 'app-view-inventory-status',
  templateUrl: './view-inventory-status.component.html',
  styleUrls: ['./view-inventory-status.component.css']
})
export class ViewInventoryStatusComponent implements OnInit {
  statuses: any = []
  displayedColumns: string[] = ['inventoryStatusId', 'inventoryStatusName', 'quantity', 'actions'];
  dataSource: any = new MatTableDataSource<InventoryStatus>()
  constructor(public dialog: MatDialog, public http: HttpClient, public service: InventoryService, public snackbar: SnackbarService, public dialogRef: MatDialogRef<ViewInventoryStatusComponent>) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  async ngOnInit(){
   await this.getStatuses()
  }

  updateStatus(status: any) {
    this.service.StatusData(status)

    this.dialog.open(UpdateInventoryStatusComponent, {disableClose: true})
    .afterClosed()
      .subscribe(async () => {
        this.snackbar.openSnackBar(), await this.getStatuses();
      });
  }

  async getStatuses(){
    await this.service.getInventoryStatus().then(
      (res) => {
        this.dataSource.data = res;
        this.statuses = res;
        console.log(this.statuses)
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('error getting statuses');
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
