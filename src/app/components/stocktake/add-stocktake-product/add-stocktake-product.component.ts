import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.API_URL;
@Component({
  selector: 'app-add-stocktake-product',
  templateUrl: './add-stocktake-product.component.html',
  styleUrls: ['./add-stocktake-product.component.css']
})
export class AddStocktakeProductComponent implements OnInit {

  addStocktake!: FormGroup;
  productItem: any = []

  constructor(public dialogRef: MatDialogRef<AddStocktakeProductComponent>, public snackBarService: SnackbarService, public http: HttpClient) { }

  ngOnInit() {
    this.getProductItems()

    this.addStocktake = new FormGroup({
      stockTakeDate: new FormControl('', [Validators.required]),
      stockTakeDesc: new FormControl('', [Validators.required]),
      productID: new FormControl('', [Validators.required])
    })
}


onNoClick(): void {
  this.snackBarService.setMessage('You chose not to add an order')
  this.dialogRef.close()
}

public confirmAdd(): void {
  if(this.addStocktake.valid){
    this.http.post(`${API_URL}/StockTake/AddStockTakeProduct`, this.addStocktake.value)
    .subscribe()
    this.snackBarService.setMessage('The order was successfully added')
    this.dialogRef.close();
  }
}

getProductItems(){
  this.http.get(`${API_URL}/Product/GetProducts`)
    .subscribe((results) => {
      this.productItem = results
    })
}
}
