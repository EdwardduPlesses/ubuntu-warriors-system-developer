import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SalesService } from 'src/app/services/sales.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})
export class EditSaleComponent implements OnInit {

  salesData: any = [];
  salestatus: any = [];

  editSaleStatus!: FormGroup

  constructor(public dialog: MatDialogRef<EditSaleComponent>, public http: HttpClient, public service: SalesService, public snackbar: SnackbarService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async confirmEditSaleStatus() {
    await this.service.UpdateSales(this.salesData[0].saleId, this.editSaleStatus.value)
    .catch((error: HttpErrorResponse) => {
      this.snackbar.setMessage(error.error.text || error.error );
      
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      let audit = 
      {
        auditDate: dateTime,
        auditDesc: this.authService.currentUser.userName + " updated Sale " + this.salesData[0].saleId + "'s status",
        username: this.authService.currentUser.userName,
        transactionType: 'Update',
        entity: 'Sales'
      }
      this.customerOrderService.addAuditTrail(audit);
    }).finally(() => {
      this.snackbar.openSnackBar();
      this.dialog.close();
    });
  }
  
  onNoClick() {
    this.snackbar.setMessage('You chose not to update the sale status')
    this.dialog.close();
  }

  async ngOnInit() {
    this.GetSaleStatus();
    this.salesData = this.service.retrieveSaleData();
    this.service.clearData();

    this.editSaleStatus = new FormGroup({
      saleId: new FormControl(this.salesData[0].saleId),
      saleStatusId: new FormControl(`${this.salesData[0].saleStatusId}`)
    })

    this.editSaleStatus.get('saleStatusId')?.setValue(this.salesData[0].saleStatusId)
  }

  async GetSaleStatus() {
    await this.service.GetSaleStatus().then(Response => { this.salestatus = Response });
  }
}