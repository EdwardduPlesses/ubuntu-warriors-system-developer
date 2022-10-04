import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { RepairService } from 'src/app/services/repair.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { AddCustomerDialogComponent } from '../../customer/add-customer-dialog/add-customer-dialog.component';

const API_URL = environment.API_URL;

@Component({
  selector: 'app-add-repair-dialog',
  templateUrl: './add-repair-dialog.component.html',
  styleUrls: ['./add-repair-dialog.component.css']
})
export class AddRepairDialogComponent implements OnInit {

  customers: any = [];
  minDate: any = []
  repairRateAmount: number = 0;
  addRepairFormControl: FormGroup = new FormGroup({});

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddRepairDialogComponent>, public http: HttpClient, public snackBarService: SnackbarService,
    public repairService: RepairService, public customerService: CustomerService, public authService: AuthService, public customerOrderService: CustomerOrderService) {
    if (this.authService.isAdminObs.getValue() === true) {
      this.addRepairFormControl = new FormGroup({
        repair_Name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]),
        repair_Description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
        repair_Customer: new FormControl('', [Validators.required]),
        repair_SelectedDate: new FormControl('', [Validators.required]),
        repair_RateAmount: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      });
    }
    else if (this.authService.isAdminObs.getValue() === false) {
      this.addRepairFormControl = new FormGroup({
        repair_Name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]),
        repair_Description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
        repair_Customer: new FormControl('', [Validators.required]),
        repair_SelectedDate: new FormControl('', [Validators.required]),
        repair_RateAmount: new FormControl(''),
      });
    }

  }

    
    

  async ngOnInit() {
    await this.GetCustomers()
   
  }


  onNoClick() {
    this.snackBarService.setMessage('You chose not to add the repair');
    this.dialogRef.close();
  }

  async confirmAddRepair(){
    console.log(this.addRepairFormControl.value)

    let yourDate = new Date()
    let formatDate = yourDate.toISOString().split('T')[0]

    let deadlineDate =  new Date(this.addRepairFormControl.value.repair_SelectedDate);

      console.log(this.addRepairFormControl.value.repair_RateAmount == "")
    if(this.addRepairFormControl.value.repair_RateAmount == ""){
      this.repairRateAmount = 0
    }
    else{
      this.repairRateAmount = this.addRepairFormControl.value.repair_RateAmount
    }

    
    

    let apiRepairSend = {
      customerId: this.addRepairFormControl.value.repair_Customer,
      repairStatusId: 1, //New Repair Status
      repairName: this.addRepairFormControl.value.repair_Name,
      repairDescription: this.addRepairFormControl.value.repair_Description,
      repairDeadlineDate: deadlineDate.toISOString().split('T')[0],
      repairStartDate: formatDate,
      repairCompleteDate: this.addRepairFormControl.value.repair_SelectedDate,
      repairCost: 0, // COst still undetermined
      repairDeadlineId: 0,
      rateHours: 0, // No hours work when new repair added
      repairRateAmount: this.repairRateAmount
    }
    
      await this.repairService.addRepair(apiRepairSend)
      .catch((error: HttpErrorResponse) => {
        this.snackBarService.setMessage(error.error.text)
        var today = new Date();
          var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var dateTime = date + ' ' + time;

          let audit =
          {
            auditDate: dateTime,
            auditDesc: this.authService.currentUser.userName + ' added Repair: ' + apiRepairSend.repairName,
            username: this.authService.currentUser.userName,
            transactionType: 'Add',
            entity: 'Repairs'
          }
          this.customerOrderService.addAuditTrail(audit);
        console.log(error.error.text)
      })
      .finally(() => {
        this.dialogRef.close();
        this.snackBarService.openSnackBar();
      })
    

      //If a employee is logged in and adds a new repair the system auto assigns the user to the repair
    // if(this.authService.isAdminObs.getValue() === false){

    // }
      
  }

  async GetCustomers(){
    await this.customerService.GetCustomers().then(results => {
      this.customers = results; 
    })
  }

  addNewCustomer() {
    this.dialog
      .open(AddCustomerDialogComponent, { disableClose: true })
      .afterClosed()
      .subscribe(async () => {
         this.snackBarService.openSnackBar(), await this.GetCustomers();
      });
  }

  getErrorMessageName() {
    
    if(this.addRepairFormControl.controls["repair_Name"].hasError('required')) {
      return "Repair Name required"
    }
    
    if(this.addRepairFormControl.controls["repair_Name"].hasError('minlength')) {
      return 'Minimum characters is 2'
    }

    if(this.addRepairFormControl.controls["repair_Name"].hasError('maxlength')) {
      return 'Maximum characters is 40' 
    }

    return null

  }

  getErrorMessageDesc(){
    if(this.addRepairFormControl.controls["repair_Description"].hasError('required')) {
      return "Repair Description required"
    }
    
    if(this.addRepairFormControl.controls["repair_Description"].hasError('minlength')) {
      return 'Minimum characters is 2'
    }

    if(this.addRepairFormControl.controls["repair_Description"].hasError('maxlength')) {
      return 'Maximum characters is 100' 
    }

    return null
  }

  getErrorMessageRate(){
    if(this.addRepairFormControl.controls["repair_RateAmount"].hasError('required')) {
      return "Repair Rate required"
    }

    if(this.addRepairFormControl.controls["repair_RateAmount"].hasError('pattern')) {
      return "Numbers only"
    }

    return null
  }

  getErrorMessageDeadline(){
    if(this.addRepairFormControl.controls["repair_SelectedDate"].hasError('required')) {
      return "Repair DeadlineDate required"
    }

    if(this.addRepairFormControl.controls["repair_SelectedDate"].hasError('min')) {
      return "Date can't be in the past"
    }

    return null
  }

  getErrorMessageCustomer(){
    if(this.addRepairFormControl.controls["repair_Customer"].hasError('required')) {
      return "Customer required"
    }

    return null
  }
}
