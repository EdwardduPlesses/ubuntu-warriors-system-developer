import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-permissions',
  templateUrl: './view-permissions.component.html',
  styleUrls: ['./view-permissions.component.css']
})
export class ViewPermissionsComponent implements OnInit {

  permissions: any[] = [];
  constructor(private authService: AuthService,
    public dialogRef: MatDialogRef<ViewPermissionsComponent>) {
    this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.authService.userPermissions.forEach((permission: any) => {
      this.permissions.push(permission);
    });
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}