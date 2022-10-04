import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-add-inventory-item',
  templateUrl: './add-inventory-item.component.html',
  styleUrls: ['./add-inventory-item.component.css']
})

export class AddInventoryItemComponent implements OnInit {

  inventoryStatus: any = [];

  addInventoryItem = new FormGroup({
    inventoryStatusId: new FormControl('', Validators.required),
    inventoryName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    inventoryDescription: new FormControl('', [Validators.required]),
    inventoryQuantity: new FormControl('', [Validators.required]),
    inventoryPrice: new FormControl('', [Validators.required]),
  })

  constructor(public dialog: MatDialogRef<AddInventoryItemComponent>, public http: HttpClient, public service: InventoryService, public snackbar: SnackbarService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async ngOnInit() {
    await this.getInventoryStatus();
    console.log(this.inventoryStatus)
    this.addInventoryItem.get('inventoryStatusId')?.setValue(1);
    this.addInventoryItem.setValue({ inventoryStatusId: 1 })
  }

  onNoClick() {
    this.snackbar.setMessage('You chose not to add a new inventory item')
    this.dialog.close()
  }

  async confirmAddInventory() {
    let apiAddInventory = {
      inventoryStatusId: this.addInventoryItem.value.inventoryStatusId,
      inventoryName: this.addInventoryItem.value.inventoryName,
      inventoryDescription: this.addInventoryItem.value.inventoryDescription,
      inventoryQuantity: this.addInventoryItem.value.inventoryQuantity,
      inventoryPrice: this.addInventoryItem.value.inventoryPrice,
    }

    await this.service.PostInventory(apiAddInventory)
      .catch((error: HttpErrorResponse) => {
        this.snackbar.setMessage(error.error.text || error.error);
        
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let audit =
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' added ' + apiAddInventory.inventoryName + 's',
          username: this.authService.currentUser.userName,
          transactionType: 'Add',
          entity: 'Inventory'
        }
        this.customerOrderService.addAuditTrail(audit);
      }).finally(() => { this.snackbar.openSnackBar(); this.dialog.close(); })
  }

  async getInventoryStatus() {
    await this.service.getInventoryStatus().then(Response => { this.inventoryStatus = Response });
  }
}