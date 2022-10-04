import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductType } from 'src/app/interface/productType';
import { ProductTypeInfoService } from 'src/app/services/product-type-info.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { AddProducttypeDialogComponent } from './add-producttype-dialog/add-producttype-dialog.component';
import { DeleteProducttypeDialogComponent } from './delete-producttype-dialog/delete-producttype-dialog.component';
import { EditProducttypeDialogComponent } from './edit-producttype-dialog/edit-producttype-dialog.component';

const API_URL = environment.API_URL + "/ProductType";

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.css']
})
export class ProductTypeComponent implements OnInit {
    productTypes: any = [];
    displayedColumns: string[] = ['ID', 'productType', 'actions'];
    dataSource = new MatTableDataSource <ProductType>();

  constructor(public dialog: MatDialog, public http: HttpClient, public snackBarService: SnackbarService,public productTypeInfoService: ProductTypeInfoService,
    public productService: ProductService) {
    this.getProductTypes()
   }

  ngOnInit(): void {
  }

  async addNewProductType(){
    this.dialog.open(AddProducttypeDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });
  }

  async updateProductType(productType: any) {
    console.log(productType);
    this.productTypeInfoService.ProductTypeInfo(productType);
    this.dialog.open(EditProducttypeDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });

  }

  async deleteProductType(productType: any) {
    this.productTypeInfoService.ProductTypeInfo(productType)
    this.dialog.open(DeleteProducttypeDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getProductTypes(){
    this.http.get(`${API_URL}/GetAllProductTypes`)
    .subscribe(results => {
      this.dataSource.data  = results as ProductType[];
    })
  }

  async refresh() {
    //Get Customers
    await this.productService.getProductTypes().then(
      (res) => {
        this.dataSource.data = res;
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackBarService.setMessage('error getting product types');
        }
      }
    );
  }

}
