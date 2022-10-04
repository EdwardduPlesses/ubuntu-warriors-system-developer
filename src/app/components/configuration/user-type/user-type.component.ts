import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { AddUserTypeDialogComponent } from './add-user-type-dialog/add-user-type-dialog.component';
import { DeleteUserTypeDialogComponent } from './delete-user-type-dialog/delete-user-type-dialog.component';
import { UserType } from '../../../interface/UserType';
import { UserTypeInfoService } from '../../../services/user-type-info.service';
import { UpdateUserTypeDialogComponent } from './update-user-type-dialog/update-user-type-dialog.component';
import { ViewUserTypeDialogComponent } from './view-user-type-dialog/view-user-type-dialog.component';


const API_URL = environment.API_URL + "/UserType";



@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
 })
 
  export class UserTypeComponent implements AfterViewInit {
    usertypes: any = [];
    displayedColumns: string[] = ['ID', 'name', 'actions'];
    dataSource = new MatTableDataSource <UserType>();

    constructor(public dialog: MatDialog, public http: HttpClient, public snackBarService: SnackbarService, public userTypeInfoService: UserTypeInfoService) { 
      this.getUserTypes();
    }
  ngAfterViewInit() {
    // throw new Error('Method not implemented.');
  }

    ngOnInit(): void {}


    addNewType(){
      this.dialog.open(AddUserTypeDialogComponent, {disableClose: true})
      .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
    }

    viewUserType() {
      this.dialog.open(ViewUserTypeDialogComponent);
  
    }
    updateUserType(usertype: any) {
      this.userTypeInfoService.UserTypeInfo(usertype);
      this.dialog.open(UpdateUserTypeDialogComponent, {disableClose: true})
      .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
  
    }

    deleteUserType(usertype: any) {
      this.userTypeInfoService.UserTypeInfo(usertype)
      this.dialog.open(DeleteUserTypeDialogComponent, {disableClose: true})
      .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
  
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getUserTypes(){
      this.http.get(`${API_URL}/GetAllUserTypes`)
      .subscribe(results => {
        this.usertypes = results
        this.dataSource.data  = results as UserType[];})
    }
  }


 

