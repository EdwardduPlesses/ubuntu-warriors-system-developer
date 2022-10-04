import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { InventoryService } from '../../../services/inventory.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.css']
})

export class UpdateInventoryItemComponent implements OnInit {

  inventoryData: any = [];
  inventorystatus: any = [];

  updateInventoryItem!: FormGroup;

  constructor(public dialog: MatDialogRef<UpdateInventoryItemComponent>, private service: InventoryService, public http: HttpClient, public snackbar: SnackbarService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async confirmEditInventory() {
    await this.service.UpdateInventory(this.updateInventoryItem.value)
    .catch((error: HttpErrorResponse) => {
      this.snackbar.setMessage(error.error.text || error.error);

      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      let audit = 
      {
        auditDate: dateTime,
        auditDesc: this.authService.currentUser.userName + ' updated ' + this.updateInventoryItem.value.inventoryName+ 's',
        username: this.authService.currentUser.userName,
        transactionType: 'Update',
        entity: 'Inventory'
      }
      this.customerOrderService.addAuditTrail(audit);
    }).finally(() => {this.snackbar.openSnackBar(); this.dialog.close();})
  }

  onNoClick() {
    this.snackbar.setMessage('You chose not to update the inventory item')
    this.dialog.close();
  }

  async ngOnInit() {
    this.inventoryData = this.service.retrieveInventoryData();
    this.service.clearData();

    this.updateInventoryItem = new FormGroup({
      inventoryId: new FormControl(this.inventoryData[0].inventoryId),
      inventoryStatusId: new FormControl(`${this.inventoryData[0].inventoryStatusId}`, [Validators.required]),
      inventoryName: new FormControl(`${this.inventoryData[0].inventoryName}`, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      inventoryDescription: new FormControl(`${this.inventoryData[0].inventoryDescription}`, [Validators.required]),
      inventoryQuantity: new FormControl(`${this.inventoryData[0].inventoryQuantity}`, [Validators.required]),
      inventoryPrice: new FormControl(`${this.inventoryData[0].inventoryPrice}`, [Validators.required]),
    });

    await this.getInventoryStatus();
    this.updateInventoryItem.get('inventoryStatusId')?.setValue(this.inventoryData[0].inventoryStatusId)
  }

  async getInventoryStatus() {
    await this.service.getInventoryStatus().then(Response => { this.inventorystatus = Response });
  }
}