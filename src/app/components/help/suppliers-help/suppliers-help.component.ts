import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-suppliers-help',
  templateUrl: './suppliers-help.component.html',
  styleUrls: ['./suppliers-help.component.css']
})
export class SuppliersHelpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SuppliersHelpComponent>) { }

  ngOnInit(): void {
  }
  
onNoClick(): void {
    this.dialogRef.close()
  }
}
