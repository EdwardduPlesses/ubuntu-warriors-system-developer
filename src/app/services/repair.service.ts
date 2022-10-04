import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;

@Injectable({
    providedIn: 'root',
})

export class RepairService {

    constructor(private httpClient: HttpClient) { }

    repairData: any = []
    public emailSending : boolean = false
    public dataLoading : boolean = false



    async getRepairs(): Promise<any> {
        let httpCall = this.httpClient.get( `${API_URL}/Repair/GetAllRepairs`)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async addRepair(repair: any) {
        let httpCall = this.httpClient.post(`${API_URL}/Repair/AddRepair`, repair)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async deleteRepair(repairID: any) {
        let httpCall = this.httpClient.delete(`${API_URL}/Repair/DeleteRepiar?repairID=${repairID}`)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async updateRepair(repair: any, repairID: any) {
        let httpCall = this.httpClient.put(`${API_URL}/Repair/UpdateRepair?repairID=${repairID}`, repair)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async updateRepairStatus(repairID: any, repairStatusID: number){
        let yourDate = new Date()
        let formatDate = yourDate.toISOString().split('T')[0]
        let httpCall = this.httpClient.put(`${API_URL}/Repair/UpdateRepairStatus?repairID=${repairID}&repairStatus=${repairStatusID}&date=${formatDate}`, null)
        let response = await lastValueFrom(httpCall)
        return response
    }

    async sendEmail(customerEmail: any){
        let httpCall = this.httpClient.post(`${API_URL}/Repair/SendEmail`, customerEmail)
        let result = (await lastValueFrom(httpCall));
        this.emailSending = false 
        return result
    }

    async getUsers(): Promise<any> {
          let httpCall = this.httpClient.get(`${API_URL}/Authentication/GetAllUsers`);
          let results = await lastValueFrom(httpCall);
          this.dataLoading = false
          return results;
    }

    async getUserRepairs(): Promise<any> {
        let httpCall = this.httpClient.get(`${API_URL}/Repair/GetAllUserRepairs`);
        let results = await lastValueFrom(httpCall);
        return results;
    }

    async updateUserRepair(userRepair: any, userRepairID: any){
        let httpCall = this.httpClient.put(`${API_URL}/Repair/UpdateUserRepair?userRepairID=${userRepairID}`, userRepair )
        let results = await lastValueFrom(httpCall);
        return results;
    }

    async addUserRepair(userRepair: any){
        let httpCall = this.httpClient.post(`${API_URL}/Repair/AddUserRepiar`, userRepair )
        let results = await lastValueFrom(httpCall);
        return results;
    }

    async addInventoryLineItem(repairInventoryLine: any){
        let httpCall = this.httpClient.post(`${API_URL}/Repair/AddInventoryLine`, repairInventoryLine )
        let results = await lastValueFrom(httpCall);
        return results;
    }

    async getRepairInventoryItems(): Promise<any> {
        let httpCall = this.httpClient.get( `${API_URL}/Repair/GetAllRepairInventoryLines`)
        let response = await lastValueFrom(httpCall)
        return response
    }

    Repair(repair: any) {
        console.log(repair)
        this.repairData.push({
            name: repair.repairName,
            description: repair.repairDescription,
            repairId: repair.repairId,
            repairStartDate: repair.repairStartDate,
            repairDeadlineDate: repair.repairDeadline.repairDeadlineDate,
            repairCustomer: repair.customer.customerName + " " + repair.customer.customerSurname,
            repairCustomerID: repair.customerId,
            repairDeadlineID: repair.repairDeadlineId,
            repairStatusID: repair.repairStatusId,
            repairCompleteDate: repair.repairCompleteDate,
            repairCost: repair.repairCost,
            userRepairs: repair.userRepairs,
            customerEmail: repair.customer.customerEmail,
            repairRateAmount: repair.repairRate.repairRateAmount,
            repairRateHours: repair.repairRate.rateHours,
            repairRateId: repair.repairRate.repairRateId,
        })

    }

    retrieveRepairData() {
        return this.repairData
    }

    isArrayFull() {
        if (this.repairData.length > 0) {
            return true
        }
        else {
            return false
        }
    }

    clearData() {
        this.repairData = [];
    }
}