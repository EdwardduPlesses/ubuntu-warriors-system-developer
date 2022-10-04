import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory-help',
  templateUrl: './inventory-help.component.html',
  styleUrls: ['./inventory-help.component.css']
})
export class InventoryHelpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InventoryHelpComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

}
