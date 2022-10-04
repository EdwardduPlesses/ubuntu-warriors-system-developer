import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent implements OnInit {
  addProduct!: FormGroup;

  productTypes!: any[];
  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>, 
    public http: HttpClient, 
    public snackBarService: SnackbarService,
    public productService: ProductService,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
    ) { }

  async ngOnInit(){

    this.addProduct = new FormGroup({
      productName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      productPrice: new FormControl('', [Validators.required, Validators.max(100000),Validators.maxLength(10)]),
      productQuantity: new FormControl('', [Validators.required, Validators.max(100000),Validators.maxLength(10)]),
      productType: new FormControl('', [Validators.required]),
    })
    this.getProductTypes();
    console.log('types', this.productTypes);
  }
  async onNoClick() {
    this.snackBarService.setMessage('You chose not to add the product')
    this.dialogRef.close()
  }

  async getProductTypes(){
    let productTypes:any[] = await this.productService.getProductTypes()
    console.log(productTypes)
    this.productTypes = productTypes;
  }

    async confirmAdd() {
      if(this.addProduct.valid){
        this.addProduct.controls['productType'].setValue(this.productTypes.find(x => x.productTypeName === this.addProduct.controls['productType'].value).productTypeId)

        let productStatusId; //1 means available, 2 means not available, 3 means low stock
        if(this.addProduct.controls['productQuantity'].value  < 1){
          productStatusId = 2;
        }
        else if(this.addProduct.controls['productQuantity'].value > 0 && this.addProduct.controls['productQuantity'].value < 10){
          productStatusId = 3;
        }
        else{
          productStatusId = 1;
        }
        let addProduct = {
          productName: this.addProduct.controls['productName'].value,
          productPrice: this.addProduct.controls['productPrice'].value,
          productQuantity: this.addProduct.controls['productQuantity'].value,
          productTypeId: this.addProduct.controls['productType'].value,
          ProductStatusId: productStatusId
        }
        console.log(this.addProduct.value);

       this.postProduct(addProduct);
       this.dialogRef.close();
      }
    }

    async postProduct(addProduct: any){
      try{
        let httpCall = this.http.post(`${API_URL}/Product/AddProduct`, addProduct);
        let result = (await lastValueFrom(httpCall));
        console.log(result);
       this.snackBarService.setMessage('The product was successfully added')

       var today = new Date();
       var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
       var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
       var dateTime = date+' '+time;

       let audit = 
       {
         auditDate: dateTime,
         auditDesc: this.authService.currentUser.userName + ' added ' + addProduct.productName + 's',
         username: this.authService.currentUser.userName,
         transactionType: 'Add',
         entity: 'Products'
       }
       this.customerOrderService.addAuditTrail(audit);
      }
      catch(error: any){
        console.log(error);
        if(error.status != 200){
          this.snackBarService.setMessage('There was an error adding the product')
        }
      }
    }
}
