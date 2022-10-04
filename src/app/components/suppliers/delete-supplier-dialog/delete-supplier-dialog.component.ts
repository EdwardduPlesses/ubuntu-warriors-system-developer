import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-delete-supplier-dialog',
  templateUrl: './delete-supplier-dialog.component.html',
  styleUrls: ['./delete-supplier-dialog.component.css']
})
export class DeleteSupplierDialogComponent implements OnInit {

  supplierData: any = [];

  constructor(public dialog: MatDialogRef<DeleteSupplierDialogComponent>, public http: HttpClient, public service: SupplierService, public snackbar: SnackbarService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async ngOnInit() {
    this.supplierData = this.service.retrieveSupplierData();
    this.service.clearData();
  }

  async confirmSupplierDelete() {
    await this.service.DeleteSupplier(this.supplierData[0].supplierId)
      .catch((error: HttpErrorResponse) => {
        this.snackbar.setMessage(error.error.text || error.error);

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let audit =
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' deleted Supplier ' + this.supplierData[0].supplierName,
          username: this.authService.currentUser.userName,
          transactionType: 'Delete',
          entity: 'Suppliers'
        }
        this.customerOrderService.addAuditTrail(audit);
      }).finally(() => { this.snackbar.openSnackBar(); this.dialog.close(); })
  }

  onNoClick() {
    this.snackbar.setMessage('You chose not to delete the supplier')
    this.dialog.close()
  }
}