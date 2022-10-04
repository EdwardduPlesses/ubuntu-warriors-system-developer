import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';
import { RepairService } from 'src/app/services/repair.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';


const API_URL = environment.API_URL + "/Repair";

@Component({
  selector: 'app-delete-repair-dialog',
  templateUrl: './delete-repair-dialog.component.html',
  styleUrls: ['./delete-repair-dialog.component.css']
})
export class DeleteRepairDialogComponent implements OnInit {

  repairData: any = [];

  constructor(public dialogRef: MatDialogRef<DeleteRepairDialogComponent>,public http: HttpClient, public snackBarService: SnackbarService, private repairService: RepairService, public customerOrderService: CustomerOrderService, public authService: AuthService) { }

  ngOnInit(): void {
    //Getting Data from the PassDataService
    this.repairData = this.repairService.retrieveRepairData();

    //Clearing the dataServiceArray
    this.repairService.clearData();
    console.log(this.repairData)
  }

  async confirmDeleteRepair(repair: any) {
   
    await this.repairService.deleteRepair(repair.repairId)
    .catch((error: HttpErrorResponse) => {
      this.snackBarService.setMessage(error.error.text)
      console.log(error.error.text)
      var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
  
        let audit = 
        {
          auditDate: dateTime,
          auditDesc: this.authService.currentUser.userName + ' deleted Repair: ' + repair.name,
          username: this.authService.currentUser.userName,
          transactionType: 'Update',
          entity: 'Repairs'
        }
        this.customerOrderService.addAuditTrail(audit);
    })
    .finally(() => {
      this.dialogRef.close();
      this.snackBarService.openSnackBar();
    })
  }

  onNoClick() {
    this.snackBarService.setMessage('You chose not to delete the repair')
    this.dialogRef.close()
  }
}

