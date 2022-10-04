import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { SnackbarService } from 'src/app/services/snackbar.service';


//Google places search autocomplete options
const options = {
  componentRestrictions: { country: "za" },
  strictBounds: false
};

export interface FormGroupControls {
  [key: string]: AbstractControl;
}
@Component({
  selector: 'app-add-customer-dialog',
  templateUrl: './add-customer-dialog.component.html',
  styleUrls: ['./add-customer-dialog.component.css'],
})
export class AddCustomerDialogComponent implements OnInit {
  customerCompetencies: any = [];
  titles: any = [];


  //Address VAR's
  streetName: string | undefined = "";
  streetNumber: string | undefined = "";
  suburbName: string | undefined = "";
  cityName: string | undefined = "";
  provinceName: string | undefined = "";
  countryName: string | undefined = "";
  loading: boolean = false;


  @ViewChild('search')
  public searchElementRef!: ElementRef;


  constructor(
    public dialogRef: MatDialogRef<AddCustomerDialogComponent>,
    public http: HttpClient,
    public snackBarService: SnackbarService, public customerService: CustomerService, public ngZone: NgZone, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  public addCustomerFormControl = new FormGroup({
    Customer_Name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.minLength(2), Validators.maxLength(36)]),
    Customer_Surname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.minLength(2), Validators.maxLength(36)]),
    Title_ID: new FormControl('', [Validators.required]),
    Address_ID: new FormControl('', [Validators.required]),
    Customer_IDNumber: new FormControl('', [Validators.required, Validators.maxLength(13), Validators.minLength(13), Validators.pattern(/([0-9][0-9])(([0][1-9])|([1][0-2]))(([0-2][0-9])|([3][0-1]))([0-9]{4})([0-1])([0-9])([0-9])/)]),
    Customer_PhoneNo: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(14)]),
    CustomerCompetencyType: new FormControl('', [Validators.required]),
    Customer_Email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)])
  });



  async confirmAddCustomer() {
    let apiSendCustomer = {
      Customer_Name: this.addCustomerFormControl.value.Customer_Name,
      Customer_Surname: this.addCustomerFormControl.value.Customer_Surname,
      Title_ID: this.addCustomerFormControl.value.Title_ID,
      Customer_IDNumber: this.addCustomerFormControl.value.Customer_IDNumber,
      Customer_PhoneNo: this.addCustomerFormControl.value.Customer_PhoneNo,
      CustomerCompetencyType: this.addCustomerFormControl.value.CustomerCompetencyType,
      Customer_Email: this.addCustomerFormControl.value.Customer_Email,
      Street_Name: this.streetName,
      Street_Number: this.streetNumber,
      Suburb_Name: this.suburbName,
      City_Name: this.cityName,
      Province_Name: this.provinceName,
      Country_Name: this.countryName
    }

    this.loading = true;
    await this.customerService.PostCustomer(apiSendCustomer)
      .catch((error: HttpErrorResponse) => {
        this.snackBarService.setMessage(error.error.text || error.error)

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let audit =
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' added ' + apiSendCustomer.Customer_Name + ' ' + apiSendCustomer.Customer_Surname,
          username: this.authService.currentUser.userName,
          transactionType: 'Add',
          entity: 'Customers'
        }
        this.customerOrderService.addAuditTrail(audit);
      })
      .finally(() => {
        this.loading = false;
        this.snackBarService.openSnackBar();
        this.dialogRef.close();
      })
  }
  // try{
  //   await this.customerService.PostCustomer(apiSendCustomer).then(() => {
  //     this.snackBarService.setMessage('Customer Added Successfully')
  //   })
  // }
  // catch(error: any){
  //   console.log(error);
  //   if(error.status != 200){
  //     this.snackBarService.setMessage('Failed to add Customer')
  //   }
  // }

  // await this.customerService.PostCustomer(apiSendCustomer).then(() =>{},
  // (response: HttpErrorResponse) => {
  //   if(response.status == 200){
  //     this.snackBarService.setMessage("Customer Added successfully")
  //     this.dialogRef.close();

  //   }
  //   else{
  //     this.snackBarService.setMessage("Failed to add Customer")
  //     this.dialogRef.close();
  //   }
  // })



  onNoClick() {
    this.snackBarService.setMessage('Customer not added');
    this.dialogRef.close();
  }

  ngOnInit() {
    this.customerService.GetTitles().then(result => {
      this.titles = result
    })

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

    if (this.addCustomerFormControl.controls["Customer_Name"].hasError('required')) {
      return "Name required"
    }

    if (this.addCustomerFormControl.controls["Customer_Name"].hasError('pattern')) {
      return "No symbols or numbers allowed"
    }

    if (this.addCustomerFormControl.controls["Customer_Name"].hasError('minlength')) {
      return 'Minimum characters is 2'
    }

    if (this.addCustomerFormControl.controls["Customer_Name"].hasError('maxlength')) {
      return 'Maximum characters is 36'
    }

    return null

  }

  getErrorMessageSurname() {
    if (this.addCustomerFormControl.controls["Customer_Surname"].hasError('required')) {
      return "Surname required"
    }

    if (this.addCustomerFormControl.controls["Customer_Surname"].hasError('pattern')) {
      return "No symbols or numbers allowed"
    }

    if (this.addCustomerFormControl.controls["Customer_Surname"].hasError('minlength')) {
      return 'Minimum characters is 2'
    }

    if (this.addCustomerFormControl.controls["Customer_Surname"].hasError('maxlength')) {
      return 'Maximum characters is 36'
    }

    return null
  }

  getErrorMessageTitle() {
    if (this.addCustomerFormControl.controls["Title_ID"].hasError('required')) {
      return "Title required"
    }

    return null
  }

  getErrorMessageAddress() {
    if (this.addCustomerFormControl.controls["Address_ID"].hasError('required')) {
      return "Address required"
    }

    return null
  }

  getErrorMessageComp() {
    if (this.addCustomerFormControl.controls["CustomerCompetencyType"].hasError('required')) {
      return "Comp required"
    }

    return null
  }

  getErrorMessagePhoneNo() {
    if (this.addCustomerFormControl.controls["Customer_PhoneNo"].hasError('required')) {
      return "Phone Number required"
    }

    if (this.addCustomerFormControl.controls["Customer_PhoneNo"].hasError('pattern')) {
      return "Numbers Only"
    }

    if (this.addCustomerFormControl.controls["Customer_PhoneNo"].hasError('minlength') || this.addCustomerFormControl.controls["Customer_PhoneNo"].hasError('maxlength')) {
      return 'Phone number is 10 digits long'
    }

    return null
  }

  getErrorMessageID() {
    if (this.addCustomerFormControl.controls["Customer_IDNumber"].hasError('required')) {
      return "ID Number required"
    }

    if (this.addCustomerFormControl.controls["Customer_IDNumber"].hasError('pattern')) {
      return "Invalid ID, must be a South African ID"
    }

    if (this.addCustomerFormControl.controls["Customer_IDNumber"].hasError('minlength') || this.addCustomerFormControl.controls["Customer_PhoneNo"].hasError('maxlength')) {
      return 'ID number is 13 digits long'
    }

    return null
  }

  getErrorMessageEmail() {
    if (this.addCustomerFormControl.controls["Customer_Email"].hasError('required')) {
      return "ID Number required"
    }

    if (this.addCustomerFormControl.controls["Customer_Email"].hasError('email')) {
      return "Not a valid Email Address"
    }

    if (this.addCustomerFormControl.controls["Customer_PhoneNo"].hasError('maxlength')) {
      return 'Max 40 digits'
    }

    return null
  }

}
