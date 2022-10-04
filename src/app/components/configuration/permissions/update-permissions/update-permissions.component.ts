import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;
@Component({
  selector: 'app-update-permissions',
  templateUrl: './update-permissions.component.html',
  styleUrls: ['./update-permissions.component.css']
})

export class UpdatePermissionsComponent implements OnInit {
  usertypes: any = []
  permissions: any[] = [];
  Selectedpermissions: any;
  SelectedUserType: any

  constructor(private authService: AuthService,
    public http: HttpClient, public snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<UpdatePermissionsComponent>,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUserTypes()
    this.authService.userPermissions.forEach((permission: any) => {
      this.permissions.push(permission);
    });
  }

  changeUserType(event: any) {
    this.SelectedUserType = event
  }


  confirmUpdate() {
    if (this.SelectedUserType == undefined || this.Selectedpermissions == undefined) {
      this.openSnackBar('Please select a user type and permission', 'Close')
    } else {

      const url = {
        userTypeID: this.SelectedUserType.toString(),
        permissions: this.Selectedpermissions.toString()
      }

      try {
        this.http.put(`${API_URL}/UserType/UpdateUserPermission?userTypeID=${url.userTypeID}&Permissions=${url.permissions}`, {})
          .subscribe((results) => {
            console.log(results)
          })
        this.openSnackBar(`User Permissions Updated Successfully`, "X");
      }
      catch (error: any) {
        if (error.status != 200) {
          console.log(error)
        }
      }
      this.dialogRef.close()
    }
  }

  onNoClick(): void {
    this.snackBarService.setMessage('You chose not to add the user')
    this.dialogRef.close()
  }

  public getUserTypes() {
    this.http.get(`${API_URL}/UserType/GetAllUserTypes`)
      .subscribe((results) => {
        this.usertypes = results
        console.log(this.usertypes)
      })
  }

  changePermission(event: any) {
    this.Selectedpermissions = event.value
    console.log('selected Permissions', this.Selectedpermissions)
    console.log(event.value)
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}