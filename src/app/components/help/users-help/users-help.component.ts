import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-users-help',
  templateUrl: './users-help.component.html',
  styleUrls: ['./users-help.component.css']
})
export class UsersHelpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UsersHelpComponent>) { }

  ngOnInit(): void {
  }
onNoClick(): void { this.dialogRef.close() }
}
