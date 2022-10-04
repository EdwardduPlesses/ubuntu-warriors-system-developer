import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SupplierOrderService } from 'src/app/services/supplier-orders.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';




@Component({
  selector: 'app-place-supplier-order-dialog',
  templateUrl: './place-supplier-order-dialog.component.html',
  styleUrls: ['./place-supplier-order-dialog.component.css']
})
export class PlaceSupplierOrderDialogComponent implements OnInit {
  addOrder!: FormGroup;
  addOrderPLine!: FormGroup;
  addOrderILine!: FormGroup;
  suppliers: any = [];
  products: any = [];
  inventories: any = [];
  orderPLines: any = [];
  orderILines: any = [];
  orders: any = [];
  orderAmount: number = 0;
  currentBasketI: any = [];
  currentBasketP: any = [];
  basketItem: any = [];

  constructor(public dialogRef: MatDialogRef<PlaceSupplierOrderDialogComponent>, public snackBarService: SnackbarService, public http: HttpClient, public supplierOrderService: SupplierOrderService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  ngOnInit() {

    let yourDate = new Date()
    let formatDate = yourDate.toISOString().split('T')[0]

    this.GetSuppliers();
    this.GetProducts();
    this.GetInventory();
    this.getLastOrder();
    console.log(this.suppliers);
    // console.log(this.suppliers);
    // console.log(this.suppliers);
    // console.log(this.suppliers);
    // console.log(this.suppliers);
    let formatDate2 = formatDate.split('-')[0] + '-' + formatDate.split('-')[1] + '-' + formatDate.split('-')[2]
    this.addOrder = new FormGroup({
      supplierId: new FormControl('', [Validators.required]),
      supplierOrderStatusId: new FormControl(1, [Validators.required]),
      orderAmount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000000)]),
      
      supplierOrderDatePlaced: new FormControl('', [Validators.required, Validators.pattern(formatDate2), Validators.min(0), Validators.max(1000000)]),
      
    })

    //---------Product Order Line--------------//

    this.addOrderPLine = new FormGroup({
      supplierOrderId: new FormControl('', [Validators.required,]),
      productId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    })

    //---------Inventory Order Line--------------//

    this.addOrderILine = new FormGroup({
      supplierOrderId: new FormControl('', [Validators.required]),
      inventoryId: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    })
    this.addOrder.controls['supplierOrderDatePlaced'].setValue(formatDate)
  }

  //----------Saving Products-------------//

    //----------Saving Products-------------//

    saveOrderPLine(){
      this.products.forEach((product: any) => {
        if(this.addOrderPLine.controls['productId'].value == product.productId) 
        {
          
            this.orderAmount += product.productPrice * this.addOrderPLine.controls['quantity'].value
            this.addOrder.controls['orderAmount'].setValue(this.orderAmount)
            this.orderPLines.push(this.addOrderPLine.value)

            this.basketItem = 
            {
              productName: product.productName,
              productPrice: product.productPrice,
              quantity: this.addOrderPLine.value.quantity,
            }
            this.currentBasketP.push(this.basketItem)
            console.log(this.basketItem)
            console.log(this.currentBasketP)
          
        }
      })
  }

  //----------Saving Inventory Items-------------//

  // saveOrderILine(){
  //   this.inventories.forEach((inventory: any) => {
  //     if(this.addOrderILine.controls['inventoryId'].value == inventory.inventoryId) 
  //     {
        
        
  //         this.orderAmount += inventory.inventoryPrice * this.addOrderILine.controls['quantity'].value
  //         this.addOrder.controls['orderAmount'].setValue(this.orderAmount)
  //         this.orderPLines.push(this.addOrderPLine.value)

  //         this.basketItem = 
  //           {
  //             inventoryName: inventory.inventoryName,
  //             inventoryPrice: inventory.inventoryPrice,
  //             quantity: this.addOrderILine.value.quantity,
  //           }
  //           this.currentBasketI.push(this.basketItem)
  //           console.log(this.basketItem)
  //           console.log(this.currentBasketI)
        
  //     }
  //   })
  // }

  //----------Saving Inventory Items-------------//

  saveOrderILine() {
    this.inventories.forEach((inventory: any) => {
      if (this.addOrderILine.controls['inventoryId'].value == inventory.inventoryId) {
        if (this.addOrderILine.controls['quantity'].value <= inventory.inventoryQuantity) {
          this.orderAmount += inventory.inventoryPrice * this.addOrderILine.controls['quantity'].value
          this.addOrder.controls['orderAmount'].setValue(this.orderAmount)
          this.orderILines.push(this.addOrderILine.value)

          this.basketItem =
          {
            inventoryName: inventory.inventoryName,
            inventoryPrice: inventory.inventoryPrice,
            quantity: this.addOrderILine.value.quantity,
          }
          this.currentBasketI.push(this.basketItem)
          console.log(this.basketItem)
          console.log(this.currentBasketI)
        }
        else {
          this.snackBarService.setMessage('The quantity selected is greater than the stock on hand')
          this.snackBarService.openSnackBar()
        }
      }
    })
  }

  undoOrderPLine() {
    this.orderPLines.pop()
    let removedItem = this.currentBasketP.pop()

    this.orderAmount -= removedItem.productPrice * removedItem.quantity
    if (this.orderAmount == 0) {
      this.addOrder.controls['orderAmount'].setValue(null)
    }
    else {
      this.addOrder.controls['orderAmount'].setValue(this.orderAmount)
    }
  }

  undoOrderILine() {
    this.orderILines.pop()
    let removedItem = this.currentBasketI.pop()

    this.orderAmount -= removedItem.inventory * removedItem.quantity
    if (this.orderAmount == 0) {
      this.addOrder.controls['orderAmount'].setValue(null)
    }
    else {
      this.addOrder.controls['orderAmount'].setValue(this.orderAmount)
    }
  }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to add an order')
    this.dialogRef.close()
  }

 
  async confirmAdd(): Promise<void> {
    this.customerOrderService.progressBar = true

    if (this.addOrder.valid) {

      await this.supplierOrderService.PostSupplierOrders(this.addOrder.value).then(async () => { },
        async (response: HttpErrorResponse) => {
          if (response.status == 200) {
            this.snackBarService.setMessage(" Updated successfully")
            await this.confirmOrderPLine();
            await this.confirmOrderILine();

            this.snackBarService.setMessage('The order was successfully placed')
            this.dialogRef.close();
          }
        }
      )}
    }
  
  //--------------Confirm PRODUCT order line--------------//

  async confirmOrderPLine() {
    if (this.addOrderPLine.valid) {
      this.orderPLines.forEach(async (orderline: any) => {
       
      await this.supplierOrderService.PostProductOrderLine(orderline).then(() =>{},
      (response: HttpErrorResponse) => {
       if(response.status == 200){
         this.snackBarService.setMessage(" Updated successfully")
         this.customerOrderService.progressBar = false
       }
       else{
         this.snackBarService.setMessage("Failed to update Order")
       }
      })
      this.snackBarService.setMessage('The product was added')
      this.dialogRef.close();
    })
  }
}

  //--------------Confirm INVENTORY order line--------------//

  async confirmOrderILine() {
    if (this.addOrderILine.valid) {
      this.orderILines.forEach(async (orderline: any) => {
      
      await this.supplierOrderService.PostInventoryOrderLine(orderline).then(() =>{},
      (response: HttpErrorResponse) => {
       if(response.status == 200){
         this.snackBarService.setMessage(" Updated successfully")
         this.customerOrderService.progressBar = false
       }
       else{
         this.snackBarService.setMessage("Failed to update Order")
       }
      })
      this.snackBarService.setMessage('The inventory item was successfully added')
      this.dialogRef.close();
      })
  }}

  async getLastOrder() {
    await this.supplierOrderService.GetSupplierOrders().then(
      results => {
        this.orders = results;
        let lastOrder = this.orders.slice(-1)
        if (lastOrder != null) {
          this.addOrderPLine.controls['supplierOrderId'].setValue(lastOrder[0].supplierOrderId + 1)
          this.addOrderILine.controls['supplierOrderId'].setValue(lastOrder[0].supplierOrderId + 1)
        }
        else {
          this.addOrderPLine.controls['supplierOrderId'].setValue(0)
          this.addOrderILine.controls['supplierOrderId'].setValue(0)
        }
      })
  }

  async GetProducts() {
    await this.supplierOrderService.GetProducts().then(results => {
      this.products = results;
    })
  }

  async GetSuppliers() {
    await this.supplierOrderService.GetSuppliers().then(results => {
      this.suppliers = results;

    })
  }
  async GetInventory() {
    await this.supplierOrderService.GetInventory().then(results => {
      this.inventories = results;
    })
  }



 
getErrorMessageSupplierName() {
  if (this.addOrder.controls['supplierId'].hasError('required')) {
    return 'You must select a Supplier';
  }
  return this.addOrder.controls['supplierId'].hasError('supplierName') ? 'Not a valid supplier name' : '';
}

getErrorMessageProductName() {
  if (this.addOrderPLine.controls['productId'].hasError('required')) {
    return 'You must select a Product';
  }
  return this.addOrderPLine.controls['productId'].hasError('productName') ? 'Not a valid product name' : '';


}

getErrorMessageInventoryName() {
  if (this.addOrderILine.controls['inventoryId'].hasError('required')) {
    return 'You must select an Inventory Item';
  }
  return this.addOrderILine.controls['inventoryId'].hasError('inventoryName') ? 'Not a valid inventory name' : '';
}

getErrorMessageQuantityI() {
  if (this.addOrderILine.controls['quantity'].hasError('required')) {
    return 'You must enter a quantity';
  }
  return this.addOrderILine.controls['quantity'].hasError('quantity') ? 'Not a valid quantity' : '';
}

getErrorMessageQuantityP() {
  if (this.addOrderPLine.controls['quantity'].hasError('required')) {
    return 'You must enter a valid quantity';
  }
  return this.addOrderPLine.controls['quantity'].hasError('quantity') ? 'Not a valid quantity' : '';
}
getErrorMessageSupplierOrderDatePlaced() {
  if (this.addOrder.controls['supplierOrderDatePlaced'].hasError('required')) {
    return 'You must enter a date';
  }
  return this.addOrder.controls['supplierOrderDatePlaced'].hasError('supplierOrderDatePlaced') ? 'Not a valid date' : '';
}
getErrorMessageOrderAmount() {
  if (this.addOrder.controls['orderAmount'].hasError('required')) {
    return 'You must enter a valid amount';
  }
  return this.addOrder.controls['orderAmount'].hasError('orderAmount') ? 'Not a valid amount' : '';





















}


}
