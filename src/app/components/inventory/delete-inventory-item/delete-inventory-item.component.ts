import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'app-delete-inventory-item',
  templateUrl: './delete-inventory-item.component.html',
  styleUrls: ['./delete-inventory-item.component.css']
})

export class DeleteInventoryItemComponent implements OnInit {

  inventoryData: any = [];

  constructor(public dialog: MatDialogRef<DeleteInventoryItemComponent>, private service: InventoryService, public http: HttpClient, public snackbar: SnackbarService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async ngOnInit() {
    this.inventoryData = this.service.retrieveInventoryData();
    this.service.clearData();
  }

  async confirmInventoryDelete() {
    await this.service.DeleteInventory(this.inventoryData[0].inventoryId)
    .catch((error: HttpErrorResponse) => {
        this.snackbar.setMessage(error.error.text || error.error);
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        let audit = 
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' deleted ' + this.inventoryData[0].inventoryName+ 's',
          username: this.authService.currentUser.userName,
          transactionType: 'Delete',
          entity: 'Inventory'
        }
        this.customerOrderService.addAuditTrail(audit);
    }).finally(() => {this.snackbar.openSnackBar(); this.dialog.close();})
  }

  onNoClick() {
    this.snackbar.setMessage('You chose not to delete the inventory item')
    this.dialog.close()
  }
}