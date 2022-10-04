import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { RepairService } from 'src/app/services/repair.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-complete-repair-dialog',
  templateUrl: './complete-repair-dialog.component.html',
  styleUrls: ['./complete-repair-dialog.component.css']
})
export class CompleteRepairDialogComponent implements OnInit {

  repairData: any = [];
  totalInventoryCost: number = 0;

  constructor(public dialogRef: MatDialogRef<CompleteRepairDialogComponent>, public snackBarService: SnackbarService, private repairService: RepairService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    //Getting Data from the PassDataService
    this.repairData = this.repairService.retrieveRepairData();

    //Clearing the dataServiceArray
    this.repairService.clearData();

    await this.getRepairInventoryLines()
  }

  async completeRepair(repair: any) {
    await this.repairService.updateRepairStatus(repair.repairId, 4).then(() => {},
    (response: HttpErrorResponse) => {
      if(response.status == 200){
        this.snackBarService.setMessage("The repair was successfully completed")

        
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      let audit = 
      {
        auditDate: dateTime,
        auditDesc: this.authService.currentUser.userName + ' completed Repair: ' + repair.name,
        username: this.authService.currentUser.userName,
        transactionType: 'Update',
        entity: 'Repairs'
      }
      this.customerOrderService.addAuditTrail(audit);
      }
      else if(response.status == 500){
        this.snackBarService.setMessage(response.error)
      }
      else{
        this.snackBarService.setMessage("Failed to complete repair")
      }
    })
    this.snackBarService.openSnackBar()
    this.dialogRef.close();
  }

  async getRepairInventoryLines() {
    await this.repairService.getRepairInventoryItems().then(res => {
        res.forEach((item:any) => {
          if(item.repairId == this.repairData[0].repairId){
            this.totalInventoryCost = this.totalInventoryCost + (item.inventory.inventoryPrice * item.quantity)

          }
        })
    }
    )
  }

  onNoClick() {
    this.dialogRef.close()
  }

}
