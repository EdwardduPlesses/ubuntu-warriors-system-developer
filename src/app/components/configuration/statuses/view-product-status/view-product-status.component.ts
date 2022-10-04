import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatSort } from '@angular/material/sort';
import { ProductService } from 'src/app/services/product.service';
import { UpdateProductStatusComponent } from '../update-product-status/update-product-status.component';

export interface ProductStatus {
  productStatusId: number;
  productStatusName: string;
  quantity: number;
}

@Component({
  selector: 'app-view-product-status',
  templateUrl: './view-product-status.component.html',
  styleUrls: ['./view-product-status.component.css']
})
export class ViewProductStatusComponent implements OnInit {
  statuses: any = []
  displayedColumns: string[] = ['productStatusId', 'productStatusName', 'quantity', 'actions'];
  dataSource: any = new MatTableDataSource<ProductStatus>()
  constructor(public dialog: MatDialog, public http: HttpClient, public service: ProductService, public snackbar: SnackbarService, public dialogRef: MatDialogRef<ViewProductStatusComponent>) { }

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

    this.dialog.open(UpdateProductStatusComponent, {disableClose: true})
    .afterClosed()
      .subscribe(async () => {
        this.snackbar.openSnackBar(), await this.getStatuses();
      });
  }

  async getStatuses(){
    await this.service.getProductStatus().then(
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
