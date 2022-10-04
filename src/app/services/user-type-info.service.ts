import {Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserTypeInfoService {

  constructor() { }

  userTypeInfo: any = []
  UserTypeInfo(usertype: any) {
    
    this.userTypeInfo.push({
      
      name: usertype.userTypeName,
      ID: usertype.userTypeId
    })

    }

  retrieveUserTypeInfo(){
    
    let retrieveUserTypeInfo = this.userTypeInfo
    return retrieveUserTypeInfo
  }

  clearData(){
    this.userTypeInfo = [];
  }
}
