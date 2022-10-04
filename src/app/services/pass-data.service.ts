import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PassDataService {

  constructor() { }

  repairData: any = []

  Repair(repair: any){
   
    this.repairData.push({ 
      name: repair.name,
      description: repair.description,
      repairID: repair.repairID,
      repairStartDate: repair.repairStartDate,
      repairDeadlineDate: repair.repairDeadlineDate,
      repairCustomer: repair.repairCustomer,
      repairCustomerID: repair.repairCustomerID,
      repairDeadlineID: repair.repairDeadlineId,
      repairStatusID: repair.repairStatusID,
      repairCompleteDate: repair.repairCompleteDate,
      repairCost: repair.repairCost,
      userRepairs: repair.userRepair
    })

  }

  retrieveRepairData(){
    return this.repairData
  }

  isArrayFull(){
    if(this.repairData.length > 0){
      return true
    }
    else{
      return false
    }
  }

  clearData(){
    this.repairData = [];
  }
}
