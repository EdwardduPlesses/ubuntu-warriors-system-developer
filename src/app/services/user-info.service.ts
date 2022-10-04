import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor() { }

  userInfo: any = []
  UserInfo(user: any){
    this.userInfo.push({ 
      id: user.id,
      username: user.userName,
      email: user.email,
      phoneNo: user.phoneNumber,
      usertype: user.userTypeId
    })
  }

  retrieveUserInfo(){
    let retrievedUserInfo = this.userInfo
 
     return retrievedUserInfo
   }
 
   clearData(){
     this.userInfo = [];
   }

}
