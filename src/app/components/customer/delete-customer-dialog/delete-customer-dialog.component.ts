import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/interface/customer-interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ViewCustomerDialogComponent } from '../view-customer-dialog/view-customer-dialog.component';

@Component({
  selector: 'app-delete-customer-dialog',
  templateUrl: './delete-customer-dialog.component.html',
  styleUrls: ['./delete-customer-dialog.component.css']
})
export class DeleteCustomerDialogComponent implements OnInit {

  customerData: Customer[] = [];

  constructor(public dialogRef: MatDialogRef<ViewCustomerDialogComponent>, private customerService: CustomerService, public http: HttpClient, public snackBarService: SnackbarService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  ngOnInit() {
    this.customerData = this.customerService.retrieveCustomerData();
    this.customerService.clearData();
  }

  confirmDeleteCustomer() {
    this.customerService.DeleteCustomer(this.customerData[0].CustomerId)
    .catch((error: HttpErrorResponse) => {
      this.snackBarService.setMessage(error.error.text || error.error)
      

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        
        let audit = 
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' deleted ' + this.customerData[0].CustomerName + ' ' + this.customerData[0].CustomerSurname,
          username: this.authService.currentUser.userName,
          transactionType: 'Delete',
          entity: 'Customers'
        }
        this.customerOrderService.addAuditTrail(audit);
    })
    .finally(() => {
      this.snackBarService.openSnackBar();
      this.dialogRef.close();
    })

  }

  onNoClick() {
    this.snackBarService.setMessage('Customer not deleted')
    this.dialogRef.close()
  }
}