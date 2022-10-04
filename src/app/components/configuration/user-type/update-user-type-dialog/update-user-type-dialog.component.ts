import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { UserTypeInfoService } from '../../../../services/user-type-info.service';

const API_URL = environment.API_URL + '/UserType';

@Component({
  selector: 'app-update-user-type-dialog',
  templateUrl: './update-user-type-dialog.component.html',
  styleUrls: ['./update-user-type-dialog.component.css'],
})
export class UpdateUserTypeDialogComponent implements OnInit {
  userTypeInfo: any = [];
  userTVM: any = [];
  updateUserType!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateUserTypeDialogComponent>,
    public userTypeInfoService: UserTypeInfoService,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public fb: FormBuilder,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.userTypeInfo = this.userTypeInfoService.retrieveUserTypeInfo();
    this.userTypeInfoService.clearData();

    this.updateUserType = new FormGroup({
      userTypeName: new FormControl(`${this.userTypeInfo[0].name}`,[Validators.required, Validators.minLength(3), Validators.maxLength(50)])
    });
  }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to update the user type');
    this.dialogRef.close();
  }

  onClick() {
    this.dialogRef.close();
  }

  submit() { }

  public confirmUpdateType() {
    this.http
      .put(
        `${API_URL}/UpdateUserType?userTypeID=${this.userTypeInfo[0].ID}`,
        this.updateUserType.value
      ).subscribe();
    this.snackBarService.setMessage('The user type was successfully updated');

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    let audit = 
    {
      auditDate: dateTime,
      auditDesc: this.authService.currentUser.userName + ' updated User Type ' + this.updateUserType.controls['userTypeName'].value,
      username: this.authService.currentUser.userName,
      transactionType: 'Update',
      entity: 'User Types'
    }
    this.customerOrderService.addAuditTrail(audit);
    this.dialogRef.close();
  }
  getErrorMessageName() {
    if (this.updateUserType.controls['userTypeName'].hasError('required')) {
      return 'You must enter a valid name';
    }
    return this.updateUserType.controls['userTypeName'].hasError('minlength') ? 'Minimum 3 characters' : '';
  }
}
