import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sales-help',
  templateUrl: './sales-help.component.html',
  styleUrls: ['./sales-help.component.css']
})
export class SalesHelpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SalesHelpComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
