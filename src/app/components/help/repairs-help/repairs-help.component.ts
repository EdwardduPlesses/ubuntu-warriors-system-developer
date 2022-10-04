import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-repairs-help',
  templateUrl: './repairs-help.component.html',
  styleUrls: ['./repairs-help.component.css']
})
export class RepairsHelpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RepairsHelpComponent>) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
