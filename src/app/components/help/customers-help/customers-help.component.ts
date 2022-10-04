import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-customers-help',
  templateUrl: './customers-help.component.html',
  styleUrls: ['./customers-help.component.css']
})
export class CustomersHelpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CustomersHelpComponent>
  ) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
