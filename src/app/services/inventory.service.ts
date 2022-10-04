import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inventory } from '../interface/inventory-interface';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  inventoryData: Inventory[] = []
  statusData: any = []

  constructor(private httpClient: HttpClient) { }

  //Get Inventory
  async GetInventory(): Promise<any> {
    let httpCall = this.httpClient.get(`${API_URL}/Inventory/GetAllInventoryItems`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Post Inventory
  async PostInventory(inventory: any) {
    let httpCall = this.httpClient.post(`${API_URL}/Inventory/AddInventoryItem`, inventory)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Update Inventory
  async UpdateInventory(inventory: any) {
    let httpCall = this.httpClient.put(`${API_URL}/Inventory/UpdateInventoryItem?ItemID=${inventory.inventoryId}`, inventory)
    let response = await lastValueFrom(httpCall)
    return response
  }

  async UpdateInventoryStatus(inventoryStatus: any) {
    let httpCall = this.httpClient.put(`${API_URL}/Inventory/UpdateInventoryStatus?inventoryStatusId=${inventoryStatus.inventoryStatusId}`, inventoryStatus)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Delete Inventory
  async DeleteInventory(inventoryId: any) {
    let httpCall = this.httpClient.delete(`${API_URL}/Inventory/DeleteInventoryItem?ItemID=${inventoryId}`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Get Inventory Status
  async getInventoryStatus(): Promise<any> {
    let httpCall = this.httpClient.get(`${API_URL}/Inventory/GetAllInventoryStatus`)
    let response = await lastValueFrom(httpCall)
    return response
  }

  //Passing Data Functions
  InventoryData(inventory: any) {
    this.inventoryData.push({
      inventoryId: inventory.inventoryId,
      inventoryStatusId: inventory.inventoryStatusId,
      inventoryStatus: inventory.inventoryStatus,
      inventoryName: inventory.inventoryName,
      inventoryDescription: inventory.inventoryDescription,
      inventoryQuantity: inventory.inventoryQuantity,
      inventoryPrice: inventory.inventoryPrice,
    })
  }

  StatusData(status: any) {
    this.statusData.push({
      inventoryStatusId: status.inventoryStatusId,
      inventoryStatusName: status.inventoryStatusName,
      quantity: status.quantity
  })
}

retrieveStatusData() {
    let retrievedStatusData = this.statusData
    return retrievedStatusData
  }

  retrieveInventoryData() {
    let retrievedInventoryData = this.inventoryData
    return retrievedInventoryData
  }

  clearData() {
    this.inventoryData = [];
    this.statusData = [];
  }
}