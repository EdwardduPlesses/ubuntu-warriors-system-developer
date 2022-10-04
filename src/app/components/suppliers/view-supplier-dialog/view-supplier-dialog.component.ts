import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SupplierService } from '../../../services/supplier.service';

@Component({
  selector: 'app-view-supplier-dialog',
  templateUrl: './view-supplier-dialog.component.html',
  styleUrls: ['./view-supplier-dialog.component.css']
})

export class ViewSupplierDialogComponent implements OnInit {

  supplierData: any = [];

  constructor(public dialog: MatDialogRef<ViewSupplierDialogComponent>, public service: SupplierService, public snackbar: SnackbarService) { }

  async ngOnInit() {
    this.supplierData = await this.service.retrieveSupplierData();
    console.log(this.supplierData);
    this.service.clearData();
  }

  onNoClick() {
    this.dialog.close()
  }
}
