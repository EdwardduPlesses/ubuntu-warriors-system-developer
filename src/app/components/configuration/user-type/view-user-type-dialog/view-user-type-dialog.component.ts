import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-user-type-dialog',
  templateUrl: './view-user-type-dialog.component.html',
  styleUrls: ['./view-user-type-dialog.component.css']
})
export class ViewUserTypeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewUserTypeDialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close();
  }

  submit(){

  }

  public closeViewType(): void {
  this.dialogRef.close();
  }

}
