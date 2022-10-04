import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { lastValueFrom } from 'rxjs';
import { UserInfoService } from 'src/app/services/user-info.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { AuthService } from 'src/app/services/auth.service';

const API_URL = environment.API_URL;


@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.css']
})
export class UpdateUserDialogComponent implements OnInit {
  userInfo: any = [];
  userVM: any = []
  usertypes: any = []
  updateUser!: FormGroup

  userTypes: any = [];
  userTypeName: any
  

  constructor(
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>, 
    public userInfoService: UserInfoService, 
    public http: HttpClient, 
    public snackBarService: SnackbarService,
    public fb: FormBuilder,
    public authService: AuthService,
    public customerOrderService: CustomerOrderService) { }

  ngOnInit(){
      this.userInfo = this.userInfoService.retrieveUserInfo();
      this.userInfoService.clearData();
      console.log(this.userInfo)

      this.getUserTypes()
      this.updateUser = new FormGroup({
        userName: new FormControl(`${this.userInfo[0].username}`, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
        email: new FormControl(`${this.userInfo[0].email}`, [Validators.required, Validators.email]),
        phoneNumber: new FormControl(`${this.userInfo[0].phoneNo}`, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]),
        userTypeID: new FormControl('', [Validators.required])
      })
  }
  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to update the user')
    this.dialogRef.close()  }
  
  submit() {
    // empty stuff
    }

    headers = new HttpHeaders().set('Content-Type', 'application/json');

    httpOptions ={
      headers: new HttpHeaders({
        ContentType: 'application/json;'
      })
    }


    async confirmUpdate(){
      if(this.updateUser.valid){
        let user = {
          userName: this.updateUser.value.userName.replace(/ /g,''),
          email: this.updateUser.value.email,
          phoneNumber: this.updateUser.value.phoneNumber,
          userTypeID: this.updateUser.value.userTypeID
        }
      try{
        let httpCall = this.http.put(`${API_URL}/Authentication/UpdateUser?userId=${this.userInfo[0].id}&newUserTypeId=${user.userTypeID}&userName=${user.userName}&email=${user.email}&phoneNumber=${user.phoneNumber}`, this.httpOptions);
        let result = (await lastValueFrom(httpCall));
        console.log(result);
      }
      catch(error: any){
        console.log(error);
        if(error.status == 200){
          this.snackBarService.setMessage('The User was successfully updated');

          var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var dateTime = date+' '+time;

          let audit = 
          {
            auditDate: dateTime,
            auditDesc: this.authService.currentUser.userName + ' updated ' + user.userName,
            username: this.authService.currentUser.userName,
            transactionType: 'Update',
            entity: 'AspNetUsers'
          }
          this.customerOrderService.addAuditTrail(audit);
        }
        else{
          this.snackBarService.setMessage('The User was not updated');
        }
      }
      this.dialogRef.close();
    }
    else{
      this.snackBarService.setMessage('Please fill out all fields');
    }
  }

    public getUserTypes(){
      this.http.get(`${API_URL}/UserType/GetAllUserTypes`)
      .subscribe((results) => {
        this.usertypes = results
        console.log(this.usertypes)
      })
    }

    // public getUserType()
    // {
    //   this.http.get(`${API_URL}/Authentication/GetUserTypeById?userId=${this.userInfo[0].id}`)
    //   .subscribe((results) => {
    //     this.userTypes = results
    //     this.userTypeName = this.userTypes.userType.userTypeName
    //   this.updateUser.controls['usertype'].setValue(this.userTypeName)
    //   })
    // }
}
