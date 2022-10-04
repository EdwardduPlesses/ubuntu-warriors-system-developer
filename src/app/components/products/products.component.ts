import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/interface/Iproduct';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ProductsHelpComponent } from '../help/products-help/products-help.component';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';
import { DeleteProductDialogComponent } from './delete-product-dialog/delete-product-dialog.component';
import { UpdateProductDialogComponent } from './update-product-dialog/update-product-dialog.component';
import { ViewProductDialogComponent } from './view-product-dialog/view-product-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements AfterViewInit {
  
  products: any = [];
  displayedColumns: string[] = ['productName', 'productQuantity', 'productPrice', 'Actions'];
  dataSource = new MatTableDataSource<Product>()
  isLoadingResults = false;
  constructor(public dialog: MatDialog, public http: HttpClient, public productService: ProductService, public snackBarService: SnackbarService) {}
  
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.productService.getProducts();
  }

  async ngOnInit() {
    this.products = await this.productService.getProducts();
    console.log(this.products);
    this.dataSource.data = this.products;
  }

  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  async addProduct() {

    this.dialog.open(AddProductDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });


  }
  async viewProduct(product: any) {
    this.productService.ProductInfo(product)
    this.dialog.open(ViewProductDialogComponent, {disableClose: true})
  }

  async updateProduct(product: any) {
    this.productService.ProductInfo(product)
    this.dialog.open(UpdateProductDialogComponent, {disableClose: true,
      autoFocus: false})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });
  }

  async deleteProduct(product: any) {
    console.log(product)
    this.productService.ProductInfo(product)
    this.dialog.open(DeleteProductDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });
  }

  async refresh() {
    //Get Products
    this.isLoadingResults = true;
    await this.productService.getProducts().then(
      (res) => {
        this.dataSource.data = res;
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackBarService.setMessage('error getting products');
        }
      }
    ).finally(() => this.isLoadingResults = false);
  }

  openProductsHelp()
  {
    this.dialog.open(ProductsHelpComponent, {disableClose: true})
  }
}
