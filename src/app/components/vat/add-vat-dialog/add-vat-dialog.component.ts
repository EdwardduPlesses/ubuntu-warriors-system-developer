import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';


const API_URL = environment.API_URL;
@Component({
  selector: 'app-add-vat-dialog',
  templateUrl: './add-vat-dialog.component.html',
  styleUrls: ['./add-vat-dialog.component.css']
})
export class AddVatDialogComponent implements OnInit {
  addVatRateControl = new FormGroup({
    rate: new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern(/\d{1,2}/)] )
  });

  constructor(
    public dialogRef: MatDialogRef<AddVatDialogComponent>,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to add a VAT Rate');
    this.dialogRef.close();
  }

  onClick(): void {
    this.dialogRef.close();
  }

  confirmAddVATRate(){
    this.http.post(`${API_URL}/Static/AddVATRate`, this.addVatRateControl.value)
    .subscribe(() => {})

    this.snackBarService.setMessage('The VAT Rate was successfully added')

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    let audit = 
    {
      auditDate: dateTime,
      auditDesc: this.authService.currentUser.userName + ' added VAT Rate: ' + this.addVatRateControl.controls['rate'].value + '%',
      username: this.authService.currentUser.userName,
      transactionType: 'Add',
      entity: 'VAT Rates'
    }
    this.customerOrderService.addAuditTrail(audit);
    this.dialogRef.close();
  }
}
