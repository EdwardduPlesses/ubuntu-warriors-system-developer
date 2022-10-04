import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/interface/customer-interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

const options = {
  componentRestrictions: { country: "za" },
  strictBounds: false
};

@Component({
  selector: 'app-edit-customer-dialog',
  templateUrl: './edit-customer-dialog.component.html',
  styleUrls: ['./edit-customer-dialog.component.css'],
})
export class EditCustomerDialogComponent implements OnInit {
  customerData: Customer[] = [];
  selectedTitle !: string
  updateCustomerFormControl!: FormGroup
  titles: any = [];

  //Address VAR's
  streetName: string | undefined = "none";
  streetNumber: string | undefined = "0";
  suburbName: string | undefined = "none";
  cityName: string | undefined = "none";
  provinceName: string | undefined = "none";
  countryName: string | undefined = "none";
  addressChanged: boolean = false;

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<EditCustomerDialogComponent>,
    private customerService: CustomerService,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    public ngZone: NgZone, 
    public customerOrderService: CustomerOrderService, 
    public authService: AuthService
  ) {}

  editCustomerFormControl = new FormControl('', [Validators.required]);


  async confirmUpdate() {

    if (this.streetName == "none") {
      this.addressChanged = false
    }
    else if (this.streetName != "none") {
      this.addressChanged = true
    }

    let customerID: number = 0;
    let apiSendCustomer = {
      Customer_Name: this.updateCustomerFormControl.value.Customer_Name,
      Customer_Surname: this.updateCustomerFormControl.value.Customer_Surname,
      Title_ID: this.updateCustomerFormControl.value.Title_ID,
      Customer_IDNumber: this.updateCustomerFormControl.value.Customer_IDNumber,
      Customer_PhoneNo: this.updateCustomerFormControl.value.Customer_PhoneNo,
      CustomerCompetencyType: this.updateCustomerFormControl.value.CustomerCompetencyType,
      Customer_Email: this.updateCustomerFormControl.value.Customer_Email,
      Street_Name: this.streetName,
      Street_Number: Number(this.streetNumber),
      Suburb_Name: this.suburbName,
      City_Name: this.cityName,
      Province_Name: this.provinceName,
      Country_Name: this.countryName,
      AddressChange: this.addressChanged
    }
    customerID = this.customerData[0].CustomerId
    console.log(apiSendCustomer)

    // this.updateCustomerFormControl.value["title_ID"] = Number(this.updateCustomerFormControl.value["title_ID"])

await this.customerService.UpdateCustomer(apiSendCustomer, customerID)
.catch((error: HttpErrorResponse) => {
  this.snackBarService.setMessage(error.error.text || error.error)
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  let audit = 
  {
    auditDate: dateTime,
    auditDesc: this.authService.currentUser.userName + ' updated ' + apiSendCustomer.Customer_Name + ' ' + apiSendCustomer.Customer_Surname,
    username: this.authService.currentUser.userName,
    transactionType: 'Update',
    entity: 'Customers'
  }
  this.customerOrderService.addAuditTrail(audit);
})
.finally(() => {
  this.snackBarService.openSnackBar();
  this.dialogRef.close();
})

}

  onNoClick() {
    this.dialogRef.close();
  }

  getErrorMessage() {
    return this.updateCustomerFormControl.hasError('required')
      ? 'Required field'
      : '';
  }
  async ngOnInit() {

    this.customerService.GetTitles().then(result => {
      this.titles = result
    })
    //Getting Data from the PassDataService
    this.customerData = this.customerService.retrieveCustomerData();
    //Clearing the dataServiceArray
    this.customerService.clearData();

    this.updateCustomerFormControl = new FormGroup({
      Customer_Name: new FormControl(`${this.customerData[0].CustomerName}`, [Validators.required]),
      Customer_Surname: new FormControl(`${this.customerData[0].CustomerSurname}`, [Validators.required]),
      Title_ID: new FormControl(``, [Validators.required]),
      Address_ID: new FormControl(`${this.customerData[0].streetNumber} ${this.customerData[0].streetName}`, [Validators.required]),
      Customer_IDNumber: new FormControl(`${this.customerData[0].CustomerIdNumber}`, [Validators.required]),
      Customer_PhoneNo: new FormControl(`${this.customerData[0].CustomerPhoneNo}`, [Validators.required]),
      CustomerCompetencyType: new FormControl(`${this.customerData[0].customerCompetencyType}`, [Validators.required]),
      Customer_Email: new FormControl(`${this.customerData[0].CustomerEmail}`, [Validators.required])
    })
    //Default customer name
    this.updateCustomerFormControl
      .get('Title_ID')
      ?.setValue(this.customerData[0].TitleId);
  }

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement, options
    );

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();


        //verify result
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

  getErrorMessageName() {

    if (this.updateCustomerFormControl.controls["Customer_Name"].hasError('required')) {
      return "Name required"
    }

    if (this.updateCustomerFormControl.controls["Customer_Name"].hasError('pattern')) {
      return "No symbols or numbers allowed"
    }

    if (this.updateCustomerFormControl.controls["Customer_Name"].hasError('minlength')) {
      return 'Minimum characters is 2'
    }

    if (this.updateCustomerFormControl.controls["Customer_Name"].hasError('maxlength')) {
      return 'Maximum characters is 36'
    }

    return null

  }

  getErrorMessageSurname() {
    if (this.updateCustomerFormControl.controls["Customer_Surname"].hasError('required')) {
      return "Surname required"
    }

    if (this.updateCustomerFormControl.controls["Customer_Surname"].hasError('pattern')) {
      return "No symbols or numbers allowed"
    }

    if (this.updateCustomerFormControl.controls["Customer_Surname"].hasError('minlength')) {
      return 'Minimum characters is 2'
    }

    if (this.updateCustomerFormControl.controls["Customer_Surname"].hasError('maxlength')) {
      return 'Maximum characters is 36'
    }

    return null
  }

  getErrorMessageTitle() {
    if (this.updateCustomerFormControl.controls["Title_ID"].hasError('required')) {
      return "Title required"
    }

    return null
  }

  getErrorMessageAddress() {
    if (this.updateCustomerFormControl.controls["Address_ID"].hasError('required')) {
      return "Address required"
    }

    return null
  }

  getErrorMessageComp() {
    if (this.updateCustomerFormControl.controls["CustomerCompetencyType"].hasError('required')) {
      return "Comp required"
    }

    return null
  }

  getErrorMessagePhoneNo() {
    if (this.updateCustomerFormControl.controls["Customer_PhoneNo"].hasError('required')) {
      return "Phone Number required"
    }

    if (this.updateCustomerFormControl.controls["Customer_PhoneNo"].hasError('pattern')) {
      return "Numbers Only"
    }

    if (this.updateCustomerFormControl.controls["Customer_PhoneNo"].hasError('minlength') || this.updateCustomerFormControl.controls["Customer_PhoneNo"].hasError('maxlength')) {
      return 'Phone number is 10 digits long'
    }

    return null
  }

  getErrorMessageID() {
    if (this.updateCustomerFormControl.controls["Customer_IDNumber"].hasError('required')) {
      return "ID Number required"
    }

    if (this.updateCustomerFormControl.controls["Customer_IDNumber"].hasError('pattern')) {
      return "Invalid ID, must be a South African ID"
    }

    if (this.updateCustomerFormControl.controls["Customer_IDNumber"].hasError('minlength') || this.updateCustomerFormControl.controls["Customer_PhoneNo"].hasError('maxlength')) {
      return 'ID number is 13 digits long'
    }

    return null
  }

  getErrorMessageEmail() {
    if (this.updateCustomerFormControl.controls["Customer_Email"].hasError('required')) {
      return "ID Number required"
    }

    if (this.updateCustomerFormControl.controls["Customer_Email"].hasError('email')) {
      return "Not a valid Email Address"
    }

    if (this.updateCustomerFormControl.controls["Customer_PhoneNo"].hasError('maxlength')) {
      return 'Max 40 digits'
    }

    return null
  }
}