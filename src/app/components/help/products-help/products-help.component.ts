import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-products-help',
  templateUrl: './products-help.component.html',
  styleUrls: ['./products-help.component.css']
})
export class ProductsHelpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProductsHelpComponent>
  ) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
