import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { UserTypeInfoService } from '../../../../services/user-type-info.service';

const API_URL = environment.API_URL + '/UserType';

@Component({
  selector: 'app-delete-user-type-dialog',
  templateUrl: './delete-user-type-dialog.component.html',
  styleUrls: ['./delete-user-type-dialog.component.css'],
})
export class DeleteUserTypeDialogComponent implements OnInit {
  userTypeInfo: any = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteUserTypeDialogComponent>,
    public userTypeInfoService: UserTypeInfoService,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public customerOrderService: CustomerOrderService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userTypeInfo = this.userTypeInfoService.retrieveUserTypeInfo();
    this.userTypeInfoService.clearData();
  }

  confirmDeleteType(usertype: any) {
    this.http
      .delete(`${API_URL}/DeleteUserType?userTypeID=${usertype.ID}`)
      .subscribe();
    this.snackBarService.setMessage('The user type was successfully deleted');

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    let audit = 
    {
      auditDate: dateTime,
      auditDesc: this.authService.currentUser.userName + ' deleted User Type ' + usertype.name,
      username: this.authService.currentUser.userName,
      transactionType: 'Update',
      entity: 'User Types'
    }
    this.customerOrderService.addAuditTrail(audit);
    this.dialogRef.close();
  }

  onNoClick() {
    this.snackBarService.setMessage('You chose not to delete the user type');
    this.dialogRef.close();
  }
}
