import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { lastValueFrom } from 'rxjs';
import { UserInfoService } from 'src/app/services/user-info.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { AuthService } from 'src/app/services/auth.service';

const API_URL = environment.API_URL;

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent implements OnInit {
  userInfo: any = [];
  

  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    public userInfoService: UserInfoService,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public authService: AuthService,
    public customerOrderService: CustomerOrderService) { }

  async ngOnInit(){
    this.userInfo = await this.userInfoService.retrieveUserInfo();
    this.userInfoService.clearData();
  }
  submit(){

  }

  async confirmDelete(user: any){
    try{
      let httpCall = this.http.delete(`${API_URL}/Authentication/DeleteUser?userId=${user.id.toString()}`);
      let result = (await lastValueFrom(httpCall));
      console.log(result);
    }
    catch(error: any){
      console.log(error);
      if(error.status == 200){
        this.snackBarService.setMessage('The user was successfully deleted');

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        let audit = 
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' deleted ' + user.username,
          username: this.authService.currentUser.userName,
          transactionType: 'Delete',
          entity: 'AspNetUsers'
        }
        this.customerOrderService.addAuditTrail(audit);
      }
      else{
        console.log(error);
      }
    }
    this.dialogRef.close();
  }

  async onNoClick(){
    this.snackBarService.setMessage('You chose not to delete the user');
    this.dialogRef.close()  
  }
}
