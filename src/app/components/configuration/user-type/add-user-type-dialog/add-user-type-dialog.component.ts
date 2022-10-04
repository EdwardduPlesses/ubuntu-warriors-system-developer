import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL + "/UserType";

@Component({
  selector: 'app-add-user-type-dialog',
  templateUrl: './add-user-type-dialog.component.html',
  styleUrls: ['./add-user-type-dialog.component.css']
})
export class AddUserTypeDialogComponent implements OnInit {
  addNewType = new FormGroup({
  userTypeName: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')])})

  constructor(public dialogRef: MatDialogRef<AddUserTypeDialogComponent>, public http: HttpClient, public snackBarService: SnackbarService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to add the user type')
    this.dialogRef.close();
  }
  submit() {

  }

  public confirmAddType(): void {
    this.http.post(`${API_URL}/AddUserType`, this.addNewType.value)
      .subscribe()
    this.snackBarService.setMessage('The user type was successfully added')

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    let audit = 
    {
      auditDate: dateTime,
      auditDesc: this.authService.currentUser.userName + ' added User Type ' + this.addNewType.controls['userTypeName'].value,
      username: this.authService.currentUser.userName,
      transactionType: 'Add',
      entity: 'User Types'
    }
    this.customerOrderService.addAuditTrail(audit);
    this.dialogRef.close();
  }
  
  getErrorMessageName() {
    if (this.addNewType.controls['userTypeName'].hasError('required')) {
      return 'You must enter a valid type';
    }

    return this.addNewType.controls['userTypeName'].hasError('pattern') ? 'Not a valid name' : '';
  }
}
