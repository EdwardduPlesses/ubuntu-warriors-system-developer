import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { AddVatDialogComponent } from './add-vat-dialog/add-vat-dialog.component';


const API_URL = environment.API_URL;
@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.css']
})
export class VatComponent implements OnInit {
  productTypes: any = [];
  displayedColumns: string[] = ['Rate', 'Date'];
  dataSource = new MatTableDataSource <any>();

constructor(public dialog: MatDialog,
   public http: HttpClient,
    public snackBarService: SnackbarService) {
  this.getVATRates()
 }

ngOnInit(): void {
}

addNewVATRate(){
  this.dialog.open(AddVatDialogComponent, {disableClose: true})
  .afterClosed().subscribe(() => this.snackBarService.openSnackBar());
}



applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

getVATRates(){
  this.http.get(`${API_URL}/Static/GetVatRates`)
  .subscribe(results => {
    this.dataSource.data  = results as any[];
  })
}

}
