import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from 'src/app/services/inventory.service';
import { RepairService } from 'src/app/services/repair.service';
import { SnackbarService } from 'src/app/services/snackbar.service';



@Component({
  selector: 'app-email-confirmation-dialog',
  templateUrl: './email-confirmation-dialog.component.html',
  styleUrls: ['./email-confirmation-dialog.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    DatePipe
  ],
})
export class EmailConfirmationDialogComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    inventoryItem: ['', Validators.required],
    itemQuantity: ['', Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  repairData: any = [];
  inventoryData: any = []
  repairInventoryLines: any = []
  inventoryMax: number = 0
  totalInventoryCost: number = 0


  constructor(public dialogRef: MatDialogRef<EmailConfirmationDialogComponent>, public http: HttpClient, public repairService: RepairService, public inventoryService: InventoryService, private snackBarService: SnackbarService, private _formBuilder: FormBuilder, private datePipe: DatePipe) { }

  async ngOnInit(): Promise<void> {
    let todaysDate = new Date();
    let date = todaysDate.toISOString().split('T')[0]
    console.log(date)
    //Getting Data from the PassDataService
    this.repairData = this.repairService.retrieveRepairData();

    //Clearing the dataServiceArray
    this.repairService.clearData();

    console.log("Repair Data",this.repairData)

    await this.getInventoryItems()
    await this.getRepairInventoryLines()

  }

  async sendEmail(repair: any) {
    let todaysDate = new Date();
    let date = this.datePipe.transform(todaysDate, 'yyyy-MM-dd');
    let startDate = new Date(repair.repairStartDate)
    let sendStartDate = startDate.toISOString().split('T')[0]

    let customerEmail = {
      emailAddress: repair.customerEmail,
      RepairCustomerName: repair.repairCustomer,
      RepairStatusId: repair.repairStatusID,
      RepairRateId: repair.repairRateId,
      RepairStartDate: sendStartDate,
      RepairCompleteDate: date,
      RepairDeadlineId: repair.repairDeadlineID,
      RepairCost: repair.repairCost + this.totalInventoryCost,
      RepairName: repair.name,
      repairDescription: repair.description,
      RepairRateAmount: repair.repairRateAmount,
      RateHours: repair.repairRateHours,
      RepairDeadlineDate: repair.repairDeadlineDate
    }

    this.repairService.emailSending = true
    await this.repairService.sendEmail(customerEmail).then(() => { },
      async (response: HttpErrorResponse) => {
        if (response.status == 200) {
          //update the repair status to email sent
          await this.repairService.updateRepairStatus(repair.repairId, 5).then(() => { },
            (response: HttpErrorResponse) => {
              if (response.status == 200) {
                this.snackBarService.setMessage("Email was successfully sent to " + repair.customerEmail)
                this.repairService.emailSending = false

              }
              else if (response.status == 500) {
                this.snackBarService.setMessage(response.error)
                this.repairService.emailSending = false
              }
              else {
                this.snackBarService.setMessage("Failed to send email to " + repair.customerEmail)
                this.repairService.emailSending = false
              }
            })
        }
        else if (response.status == 500) {
          this.snackBarService.setMessage(response.error)
          this.repairService.emailSending = false
        }
        else {
          this.snackBarService.setMessage("Failed to send email to " + repair.customerEmail)
          this.repairService.emailSending = false
        }
      })

      //input values
      this.firstFormGroup.get('inventoryItem')?.setValue('')
      this.firstFormGroup.get('itemQuantity')?.setValue('')
    this.dialogRef.close()
  }

  onNoClick() {
    this.snackBarService.setMessage('You chose not to send the email')
    this.dialogRef.close()
  }

  async getInventoryItems() {
    await this.inventoryService.GetInventory().then(res => {
      this.inventoryData = res
    })
  }

  async addRepairInventoryLineItem() {

    let repairInventoryLine = {
      repairId: this.repairData[0].repairId,
      inventoryId: this.firstFormGroup.value.inventoryItem,
      quantity: this.firstFormGroup.value.itemQuantity
    }

    await this.repairService.addInventoryLineItem(repairInventoryLine).then(() => { },
      async (response: HttpErrorResponse) => {
        if (response.status == 200) {
          //Do Something
          await this.getRepairInventoryLines()
          console.log("Added Successfully")
        }
      })
  }

  async getRepairInventoryLines() {
    this.repairInventoryLines = []
    await this.repairService.getRepairInventoryItems().then(res => {
      console.log(this.inventoryData)
        res.forEach((item:any) => {
          if(item.repairId == this.repairData[0].repairId){
            this.totalInventoryCost = this.totalInventoryCost + (item.inventory.inventoryPrice * item.quantity)
            this.repairInventoryLines.push(item)
          }
        })
    }
    )
  }

  changeInputMax(itemID:number){
    this.inventoryData.forEach((item:any) => {
      if(itemID == item.inventoryId){
        this.inventoryMax = item.inventoryQuantity
      }
    })
  }
}
