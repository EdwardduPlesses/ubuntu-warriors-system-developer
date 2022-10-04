import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { RepairService } from 'src/app/services/repair.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { DeleteRepairDialogComponent } from '../delete-repair-dialog/delete-repair-dialog.component';


const API_URL = environment.API_URL;

@Component({
  selector: 'app-view-repair-dialog',
  templateUrl: './view-repair-dialog.component.html',
  styleUrls: ['./view-repair-dialog.component.css'],
})
export class ViewRepairDialogComponent implements OnInit {
  repairData: any = []
  repairUsers: any = []
  userRepairs: any = []
  userRepairValue: string = "No one Assigned"


  constructor(
    public dialogRef: MatDialogRef<DeleteRepairDialogComponent>,
    public http: HttpClient,
    public snackBarService: SnackbarService,
    private repairService: RepairService
  ) {}

  viewRepairFormControl = new FormGroup({
    userRepair: new FormControl(`${this.userRepairValue}`),
    });

  async ngOnInit() {
    await this.getUsers()
    await this.getUserRepairs()

    //Getting Data from the PassDataService
    this.repairData = this.repairService.retrieveRepairData();

    //Clearing the dataServiceArray
    this.repairService.clearData();


    await this.userRepairs.forEach(async (userRepair: any) => {
      await this.repairUsers.forEach(async (user: any) =>{
        await this.repairData.forEach((repair: any) => {
        if(repair.repairId === userRepair.repairId && userRepair.userId === user.id){
          this.userRepairValue = user.userName;
        }
        })
      })
  })
    console.log(this.userRepairValue)
    this.viewRepairFormControl.get("userRepair")?.setValue(this.userRepairValue)
  }


  onNoClick() {
    this.snackBarService.setMessage('View Closed');
    this.dialogRef.close();
  }

  async getUsers() {
    await this.repairService.getUsers().then(res =>{
      this.repairUsers = res
    })
  }

  async getUserRepairs(){
    await this.repairService.getUserRepairs().then(results => {
      this.userRepairs = results;
    })
  }
}
