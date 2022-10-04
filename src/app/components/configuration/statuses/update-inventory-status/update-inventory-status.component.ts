import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';

@Component({
  selector: 'app-update-inventory-status',
  templateUrl: './update-inventory-status.component.html',
  styleUrls: ['./update-inventory-status.component.css']
})
export class UpdateInventoryStatusComponent implements OnInit {
  updateStatusForm!: FormGroup;
  statusData: any = []
  constructor(public dialogRef: MatDialogRef<UpdateInventoryStatusComponent>, public http: HttpClient, private snackbar: SnackbarService, public inventoryService: InventoryService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async ngOnInit() {
    this.statusData = this.inventoryService.retrieveStatusData();
    this.inventoryService.clearData();

    this.updateStatusForm = new FormGroup({
      inventoryStatusId: new FormControl(`${this.statusData[0].inventoryStatusId}`, [Validators.required]),
      inventoryStatusName: new FormControl(`${this.statusData[0].inventoryStatusName}`, [Validators.required]),
      quantity: new FormControl(`${this.statusData[0].quantity}`, [Validators.required,Validators.min(0),]),
  });
}

async confirmUpdate() {
  await this.inventoryService.UpdateInventoryStatus(this.updateStatusForm.value).then(() => { },
    (response: HttpErrorResponse) => {
      if (response.status == 200) {
        this.snackbar.setMessage("Inventory Status Edited Successfully")

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        let audit = 
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' updated ' + this.updateStatusForm.value.inventoryStatusName+ 's quantity',
          username: this.authService.currentUser.userName,
          transactionType: 'Update',
          entity: 'Inventory Status'
        }
        this.customerOrderService.addAuditTrail(audit);
      }
      else {
        this.snackbar.setMessage("Failed to Edit Inventory Status")
      }
    })
  this.dialogRef.close();
}

onNoClick(){
  this.snackbar.setMessage('You chose not to edit the status');

  this.dialogRef.close();
}

}
