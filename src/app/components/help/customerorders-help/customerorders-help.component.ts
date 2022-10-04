import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customerorders-help',
  templateUrl: './customerorders-help.component.html',
  styleUrls: ['./customerorders-help.component.css']
})
export class CustomerordersHelpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CustomerordersHelpComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

}
