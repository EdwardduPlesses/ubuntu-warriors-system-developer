import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { lastValueFrom } from 'rxjs';
import { UserInfoService } from 'src/app/services/user-info.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { AuthService } from 'src/app/services/auth.service';

const API_URL = environment.API_URL;




@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {
  addUser!: FormGroup;
  usertypes: any = []
  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>, 
    public http: HttpClient, 
    public snackBarService: SnackbarService,
    public userInfoService: UserInfoService, 
    public authService: AuthService,
    public customerOrderService: CustomerOrderService
    ) { }

  ngOnInit(){
    let retVal = Math.random().toString(36).slice(2, 10)
    console.log(retVal)

    this.getUserTypes()

    this.addUser = new FormGroup({
      userName: new FormControl('', [Validators.required,Validators.minLength(5), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(`${retVal}`, [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required,  Validators.minLength(14), Validators.maxLength(14)]),
      userTypeID: new FormControl('', [Validators.required])
    })
  }
  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to add the user')
    this.dialogRef.close()
  }
  
  submit() {
    // empty stuff
    }

    headers = new HttpHeaders().set('Content-Type', 'application/json');

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json;'
    })
  }

    async confirmAdd() {
      if(this.addUser.valid){
        let user = {
          userName: this.addUser.value.userName.replace(/ /g,''),
          email: this.addUser.value.email,
          password: this.addUser.value.password,
          phoneNumber: this.addUser.value.phoneNumber,
          userTypeID: this.addUser.value.userTypeID
        }
        try{
          console.log(user)
          let httpCall = this.http.post(`${API_URL}/Authentication/Register?userName=${user.userName}&email=${user.email}&password=${user.password}&phoneNumber=${user.phoneNumber}&userTypeID=${user.userTypeID}`, this.httpOptions);
          let result = (await lastValueFrom(httpCall));
        }
        catch(error: any){
          console.log(error)
          if(error.status === 200){
            this.snackBarService.setMessage('The user was successfully added')

                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date+' '+time;

                let audit = 
                {
                  auditDate: dateTime,
                  auditDesc: this.authService.currentUser.userName + ' added ' + user.userName,
                  username: this.authService.currentUser.userName,
                  transactionType: 'Add',
                  entity: 'AspNetUsers'
                }
                this.customerOrderService.addAuditTrail(audit);
          }
          else{
            this.snackBarService.setMessage('There was an error adding the user')
          }
        }
        this.dialogRef.close();
      }
      else{
        this.snackBarService.setMessage('Please fill out all fields.')
      }
      
    }

    public getUserTypes(){
      this.http.get(`${API_URL}/UserType/GetAllUserTypes`)
      .subscribe((results) => {
        this.usertypes = results
        console.log(this.usertypes)
      })
    }

    
}
