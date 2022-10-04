import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';
import { ViewUserDialogComponent } from './view-user-dialog/view-user-dialog.component';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../../services/user-info.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UsersHelpComponent } from '../help/users-help/users-help.component';

const API_URL = environment.API_URL;

export interface User {
  username: string;
  password: string;
  phoneNo: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements AfterViewInit {
  users: any = [];
  displayedColumns: string[] = ['username', 'phoneNo', 'actions'];
  dataSource = new MatTableDataSource<User>()
  constructor(public dialog: MatDialog
    , public http: HttpClient
    , public userInfoService: UserInfoService
    , public snackBarService: SnackbarService
    , public authService: AuthService) {}


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.getUsers();
  }
  async addUser() {

    this.dialog.open(AddUserDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });


  }
  async viewUser(user: any) {
    this.userInfoService.UserInfo(user)
    this.dialog.open(ViewUserDialogComponent, {disableClose: true})
  }
  async updateUser(user: any) {
    this.userInfoService.UserInfo(user)
    this.dialog.open(UpdateUserDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });

  }

  async deleteUser(user: any) {
    this.userInfoService.UserInfo(user)

    this.dialog.open(DeleteUserDialogComponent, {disableClose: true})
    .afterClosed().subscribe(async () => {
      this.snackBarService.openSnackBar(), await this.refresh();
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getUsers(){
    this.http.get(`${API_URL}/Authentication/GetAllUsers`)
    .subscribe(results => {
      this.users = results;
      this.dataSource.data = results as User[];
    })
  }

  async refresh() {
    //Get Customers
    await this.authService.getUsers().then(
      (res: any) => {
        this.dataSource.data = res;
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackBarService.setMessage('error getting users');
        }
      }
    );
  }
  openUsersHelp()
  {
    this.dialog.open(UsersHelpComponent, {disableClose: true})
  }
}
