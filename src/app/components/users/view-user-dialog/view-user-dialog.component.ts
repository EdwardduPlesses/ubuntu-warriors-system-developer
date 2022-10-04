import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInfoService } from '../../../services/user-info.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.API_URL;

@Component({
  selector: 'app-view-user-dialog',
  templateUrl: './view-user-dialog.component.html',
  styleUrls: ['./view-user-dialog.component.css']
})
export class ViewUserDialogComponent implements OnInit {

  userInfo: any = [];
  viewUser!: FormGroup
  userTypes: any = [];
  userTypeName: any

  constructor(public dialogRef: MatDialogRef<ViewUserDialogComponent>, public userInfoService: UserInfoService, public http: HttpClient) { }

  ngOnInit(){
    this.userInfo = this.userInfoService.retrieveUserInfo();
    this.userInfoService.clearData();

    this.getUserType()

    this.viewUser = new FormGroup({
      usertype: new FormControl('', [Validators.required]),
      username: new FormControl(`${this.userInfo[0].username}`, [Validators.required]),
      email: new FormControl(`${this.userInfo[0].email}`, [Validators.required]),
      phoneNo: new FormControl(`${this.userInfo[0].phoneNo}`, [Validators.required]),
    })
    }
  
  submit() {
    // empty stuff
    }
    public onNoClick(): void {
      this.dialogRef.close();
    }

    public getUserType()
    {
      this.http.get(`${API_URL}/Authentication/GetUserTypeById?userId=${this.userInfo[0].id}`)
      .subscribe((results) => {
        this.userTypes = results
        this.userTypeName = this.userTypes.userType.userTypeName
      this.viewUser.controls['usertype'].setValue(this.userTypeName)
      })
    }
}
