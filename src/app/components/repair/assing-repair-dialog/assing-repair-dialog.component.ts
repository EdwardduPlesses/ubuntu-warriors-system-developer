import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RepairService } from 'src/app/services/repair.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { AddRepairDialogComponent } from '../add-repair-dialog/add-repair-dialog.component';

const API_URL = environment.API_URL;


@Component({
  selector: 'app-assing-repair-dialog',
  templateUrl: './assing-repair-dialog.component.html',
  styleUrls: ['./assing-repair-dialog.component.css']
})
export class AssingRepairDialogComponent implements OnInit {

  repairUsers: any = []
  repair: any = []
  repairUserDefault: string = ""
  userRepairID: number = 0
  userRepairs: any = []
  
  

  constructor(public dialogRef: MatDialogRef<AddRepairDialogComponent>, public http: HttpClient, public snackBarService: SnackbarService, public repairService: RepairService) { }

  public assignRepairFormControl = new FormGroup({
    repair_User: new FormControl('', [Validators.required])
  });

  async ngOnInit() {
    await this.getUsers()
    await this.getUserRepairs()
    //Getting Data from the PassDataService
    this.repair = await this.repairService.retrieveRepairData();
    //Clearing the dataServiceArray
    this.repairService.clearData();

    console.log(this.repairUsers)

    
    await this.userRepairs.forEach(async (userRepair: any) => {
        await this.repairUsers.forEach(async (user: any) =>{
          await this.repair.forEach((repair: any) => {
          if(repair.repairId === userRepair.repairId && userRepair.userId === user.id){
            this.repairUserDefault = user.id;
            this.userRepairID = userRepair.userRepairId
          }
          })
        })
    })
    
    //Default customer name
    this.assignRepairFormControl.get('repair_User')?.setValue(this.repairUserDefault);
  }

  async confirmAddUserRepair(){

    let apiSendUserRepair ={
      repairID: this.repair[0].repairId,
      userID: this.assignRepairFormControl.value.repair_User
    }

    //Checking if repair is already assigned
    if(this.repairUserDefault != ""){
      //Put
      await this.repairService.updateUserRepair(apiSendUserRepair, this.userRepairID).then(() => {},
      (response: HttpErrorResponse) => {
        if(response.status == 200){
          this.snackBarService.setMessage("The user working on the repair was successfully updated")
        }
        else if(response.status == 500){
          this.snackBarService.setMessage(response.error)
        }
        else{
          this.snackBarService.setMessage("Failed to update user working on the repair")
        }
      })
      .finally(() => {
        this.dialogRef.close();
        this.snackBarService.openSnackBar();
      })
    }
    else{
      //Post
      await this.repairService.addUserRepair(apiSendUserRepair).then(() => {},
      (response: HttpErrorResponse) => {
        if(response.status == 200){
          this.snackBarService.setMessage("Assigned user to repair")
        }
        else if(response.status == 500){
          this.snackBarService.setMessage(response.error)
        }
        else{
          this.snackBarService.setMessage("Failed to assign user to repair")
        }
      })
      .finally(() => {
        this.dialogRef.close();
        this.snackBarService.openSnackBar();
      })
    }

  }

  onNoClick() {
    this.snackBarService.setMessage('You chose not to add the User Repair');
    this.dialogRef.close();
  }

  async getUsers(){
    await this.repairService.getUsers().then(results => {
      this.repairUsers = results;
    })
  }

  async getUserRepairs(){
    await this.repairService.getUserRepairs().then(results => {
      this.userRepairs = results;
    })
  }

}
