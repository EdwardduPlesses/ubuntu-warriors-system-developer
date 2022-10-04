import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SupplierService } from '../../../services/supplier.service';

const options = {
  componentRestrictions: { country: "za" },
  strictBounds: false
};
@Component({
  selector: 'app-update-supplier-dialog',
  templateUrl: './update-supplier-dialog.component.html',
  styleUrls: ['./update-supplier-dialog.component.css']
})
export class UpdateSupplierDialogComponent implements OnInit {

  supplierData: any = [];
  loading: boolean = false;
  updateSupplier!: FormGroup;

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  streetName: string | undefined = "";
  streetNumber: string | undefined = "";
  suburbName: string | undefined = "";
  cityName: string | undefined = "";
  provinceName: string | undefined = "";
  addressChanged: boolean = false;
  countryName: string | undefined = "";

  constructor(public dialog: MatDialogRef<UpdateSupplierDialogComponent>, private service: SupplierService, public http: HttpClient, public snackbar: SnackbarService, public ngZone: NgZone, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async confirmSupplierUpdate() {
    if (this.streetName == "") {
      this.addressChanged = false
    }
    else if (this.streetName != "") {
      this.addressChanged = true
    }
    let addressSend = {
      supplierName: this.updateSupplier.value.supplierName,
      addressId: 0,
      supplierPhoneNo: this.updateSupplier.value.supplierPhoneNo,
      supplierEmail: this.updateSupplier.value.supplierEmail,
      Street_Name: this.streetName,
      Street_Number: Number(this.streetNumber),
      Suburb_Name: this.suburbName,
      City_Name: this.cityName,
      Province_Name: this.provinceName,
      Country_Name: this.countryName,
      AddressChanged: this.addressChanged
    }

    this.loading = true;
    await this.service.UpdateSupplier(this.supplierData[0].supplierId, addressSend)
      .catch((error: HttpErrorResponse) => {
        this.snackbar.setMessage(error.error.text || error.error);

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let audit =
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' updated Supplier ' + addressSend.supplierName,
          username: this.authService.currentUser.userName,
          transactionType: 'Update',
          entity: 'Suppliers'
        }
        this.customerOrderService.addAuditTrail(audit);
      }).finally(() => { this.loading = false, this.dialog.close(); this.snackbar.openSnackBar() })
  }

  onNoClick() {
    this.dialog.close();
  }

  async ngOnInit() {
    this.supplierData = this.service.retrieveSupplierData();
    this.service.clearData();

    this.updateSupplier = new FormGroup({
      supplierId: new FormControl(this.supplierData[0].supplierId),
      supplierName: new FormControl(`${this.supplierData[0].supplierName}`, [Validators.required]),
      supplierPhoneNo: new FormControl(`${this.supplierData[0].supplierPhoneNo}`, [Validators.required]),
      supplierEmail: new FormControl(`${this.supplierData[0].supplierEmail}`, [Validators.required]),
      supplierAddress: new FormControl(`${this.supplierData[0].addressId.streetNumber}, ${this.supplierData[0].addressId.streetName}`, [Validators.required]),
    })
  }

  ngAfterViewInit(): void {
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement, options
    );

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        else {
          this.streetNumber = place.name?.replace(/[^0-9]/g, '')
          this.suburbName = place.vicinity

          if (place.address_components != undefined) {
            this.cityName = place.address_components[3].long_name
            this.provinceName = place.address_components[5].long_name
            this.countryName = place.address_components[6].long_name
            this.streetName = place.address_components[1].long_name
          }
        }
      })
    })
  }
}