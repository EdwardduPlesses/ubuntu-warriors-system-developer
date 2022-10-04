import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-supplieroders-help',
  templateUrl: './supplieroders-help.component.html',
  styleUrls: ['./supplieroders-help.component.css']
})
export class SupplierodersHelpComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SupplierodersHelpComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

}
