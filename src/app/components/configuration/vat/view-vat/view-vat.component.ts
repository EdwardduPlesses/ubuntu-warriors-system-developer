import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { VatService } from 'src/app/services/vat.service';

@Component({
  selector: 'app-view-vat',
  templateUrl: './view-vat.component.html',
  styleUrls: ['./view-vat.component.css']
})
export class ViewVatComponent implements OnInit {
  vatInfo: any = [];

  constructor(public dialogRef: MatDialogRef<ViewVatComponent>, public http: HttpClient, public snackBarService: SnackbarService, public vatService: VatService) { }

  async ngOnInit() {
    this.vatInfo = await this.vatService.getCurrentVatRate();
  }

  async back(){
    this.dialogRef.close()
  }

}
