import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from 'src/app/services/inventory.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-view-inventory-item',
  templateUrl: './view-inventory-item.component.html',
  styleUrls: ['./view-inventory-item.component.css']
})

export class ViewInventoryItemComponent implements OnInit {

  inventoryData: any = [];

  constructor(public dialog: MatDialogRef<ViewInventoryItemComponent>, public service: InventoryService, public snackbar: SnackbarService) { }

  async ngOnInit() {
    this.inventoryData = await this.service.retrieveInventoryData();
    this.service.clearData();
  }

  onNoClick() {
    this.dialog.close()
  }
}