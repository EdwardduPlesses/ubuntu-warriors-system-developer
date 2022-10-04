import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, lastValueFrom, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { RegisterUser } from '../interface/register-user';
import { CustomerOrderService } from 'src/app/services/customerOrder.service';


const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  //currentUserEmail
  currentUserEmail: any;

  //current user
  currentUser: any;

  //user Role
  userRole: any;

  //user permissions
  userPermissions: any[] = [];

  //array of for all registered users
  registerUsers: any[] = [];

  //otp pending (being sent)
  otpPending: boolean = false;

  //OTP to be validated
  otpToValidate!: number;

  //confirmedOTP
  confirmedOTP!: boolean;


  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public forgotPasswordObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAdminObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public aboutPageObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //observable for logged in
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  //if user forgot password
  get forgotPassword() {
    return this.forgotPasswordObs.asObservable();
  }
  //observable for admin role
  get isAdmin(){
  return this.isAdminObs.asObservable();
  }
  
  get goToAboutPage(){
  return this.aboutPageObs.asObservable();
  }


  headers = new HttpHeaders().set('Content-Type', 'application/json');

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json;'
    })
  }

  constructor(private http: HttpClient, public router: Router, private snackBar: MatSnackBar, public customerOrderService: CustomerOrderService) { }

  //TODO: NEEDS to be async and modified
  RegisterUser(registerUser: RegisterUser) {
    return this.http.post(`${API_URL}/Authentication/Register`, registerUser, this.httpOptions)
  }

  // get all registered users
  async getUsers() {
    try {
      let httpCall = this.http.get<any[]>(`${API_URL}/Authentication/GetAllUsers`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));
      this.registerUsers = result;
      console.log('Registered Users: ', result);
      return result;
    }
    catch (error) {
      console.log(error);
      return throwError(error);
    }
  }

  async getcurrentUserEmail() {
    const token = localStorage.getItem('token');
    return this.currentUserEmail = this.getDecodedAccessToken(token);
  }

  // async getCurrentUserRole(){
  //   const token = localStorage.getItem('token');
  //   return this.userRole = this.getDecodedAccessToken(token);
  // }

  getDecodedAccessToken(token: any) {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  async LoginUser(loginUser: any) {
    try {
      let httpCall = this.http.post<any>(`${API_URL}/Authentication/Login?email=${loginUser.email}&password=${loginUser.password}`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));
      localStorage.setItem('token', result.token);
      console.log(result);
      this.openSnackBar("Login Successful", "X");
      this.isUserAuthenticated();
      // this.isUserAdmin();
      // this.getUserInfo();
      // await this.getcurrentUserEmail();
      // this.currentUser = await this.registerUsers.find(x => x.email == this.currentUserEmail.unique_name)
      // var today = new Date();
      // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // var dateTime = date+' '+time;

      // let audit = 
      // {
      //   auditDate: dateTime,
      //   auditDesc: this.currentUser.userName + ' logged in',
      //   username: this.currentUser.userName,
      //   transactionType: 'Login',
      //   entity: 'AspNetUsers'
      // }
      // this.customerOrderService.addAuditTrail(audit);
    }
    catch (error) {
      this.openSnackBar("Invalid Credentials", "X");
    }
  }

  async isUserAuthenticated() {
    const token = localStorage.getItem("token");
    if (token) {
      this.loggedIn.next(true);
      this.isUserAdmin();
      this.getUserInfo();
      if (this.isAdminObs.getValue() == true) {
        this.router.navigate(['/dashboard']);
      }
      else {
        this.router.navigate(['/products']);
      }
    }
    else {
      this.loggedIn.next(false);
      this.router.navigate(['/login']);
    }
  }

  async isUserAdmin() {
    const token = localStorage.getItem('token');
    this.userRole = this.getDecodedAccessToken(token);
    if (this.userRole.role === 'Admin') {
      this.isAdminObs.next(true);
    }
    else {
      this.isAdminObs.next(false);
    }
  }

  async getUserInfo() {
    await this.getUsers()
    await this.getcurrentUserEmail();
    await this.getPermissions();
    await this.isUserAdmin();
    this.currentUser = await this.registerUsers.find(x => x.email == this.currentUserEmail.unique_name);
    // add userpermissions to the current user
    this.currentUser.role = this.userRole.role
    this.currentUser.permissions = this.userPermissions;
    console.log('USER INFO', this.currentUser);
    return await this.currentUser;
  }

  async doLogout() {
    this.loggedIn.next(false);
    localStorage.removeItem("token");
    this.openSnackBar("Logout Successful", "X");
  }

  async resetPasswordSelect() {
    this.forgotPasswordObs.next(true);
    this.router.navigate(['/reset-password']);
  }

  async aboutPageSelect(){
    this.aboutPageObs.next(true);
    this.router.navigate(['/about']);
  }


  async sendOTP(email: string) {
    //retreive user's info
    await this.getUsers()
    console.log('inputted email: ', email);
    console.log('all registerd Users', this.registerUsers);
    let user = this.registerUsers.find(user => user.email == email);
    this.currentUser = user;
    console.log('user info: ', user);

    // if email is registered
    if (user) {
      try {
        let httpCall = this.http.post<any>(`${API_URL}/Authentication/SendOTP?emailAddress=${user.email}`, this.httpOptions)
        let result = (await lastValueFrom(httpCall));
        this.otpToValidate = result;
        this.otpPending = false;
        console.log('OTP', this.otpToValidate);
        this.openSnackBar("OTP Sent", "X");
      }
      catch (error: any) {
        this.openSnackBar("Error sending OTP", "X");
      }
    }
    // if email is not registered
    else {
      this.otpPending = false;
      this.openSnackBar("Email not registered", "X");
    }

  }

  async validateOTP(otp: number) {
    if (this.otpToValidate == otp) {
      this.openSnackBar("OTP Validated Successfully", "X");
      this.confirmedOTP = true;
      return true
    }
    else {
      {
        this.openSnackBar("OTP Invalid", "X");
        this.confirmedOTP = false;
        return false
      }
    }
  }

  async resetPassword(NewPassword: string) {
    const user = this.currentUser;
    try {
      let httpCall = this.http.put<any>(`${API_URL}/Authentication/ResetPassword?userId=${user.id}&newPassword=${NewPassword}`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));
      this.forgotPasswordObs.next(false);
    }
    catch (error: any) {
      if (error.status == 200) {
        this.openSnackBar("Password Changed Successfully", "X");
        this.forgotPasswordObs.next(false);

        //   var today = new Date();
        // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // var dateTime = date+' '+time;

        // let audit = 
        // {
        //   auditDate: dateTime,
        //   auditDesc: this.currentUser.userName + ' reset password',
        //   username: this.currentUser.userName,
        //   transactionType: 'Update',
        //   entity: 'AspNetUsers'
        // }
        // this.customerOrderService.addAuditTrail(audit);
      }
      else if (error.status == 500) {
        this.openSnackBar("Error Changing Password", "X");
      }
      console.log(error);
    }
  }

  async changePassword(changePwdInfo: any) {
    try {
      await this.getUsers()
      const pwdInfo = {
        userId: this.registerUsers.find(user => user.email == changePwdInfo.email).id,
        oldPassword: changePwdInfo.oldPassword,
        newPassword: changePwdInfo.newPassword
      }
      console.log('Old Password: ', pwdInfo.oldPassword);
      console.log('New Password: ', pwdInfo.newPassword);
      const token = localStorage.getItem('token');
      console.log('Token: ', token);
      const user = this.getDecodedAccessToken(token);
      console.log('UserId: ', pwdInfo.userId);
      let httpCall = this.http.put<any>(`${API_URL}/Authentication/ChangePassword?userId=${pwdInfo.userId}&oldPassword=${pwdInfo.oldPassword}&newPassword=${pwdInfo.newPassword}`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));
      console.log(result);
      this.openSnackBar("Password Changed Successfully", "X");

      //Audit Trail
      // var today = new Date();
      // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // var dateTime = date+' '+time;

      // let audit = 
      // {
      //   auditDate: dateTime,
      //   auditDesc: this.currentUser.userName + ' changed password',
      //   username: this.currentUser.userName,
      //   transactionType: 'Update',
      //   entity: 'AspNetUsers'
      // }
      // this.customerOrderService.addAuditTrail(audit);
    }
    catch (error: any) {
      //get response from API
      if (error.status === 200) {
        this.openSnackBar(`${error.error.text}`, "X");
      }
      else if (error.status === 500) {
        this.openSnackBar("Incorect Current Password, Please try again", "X");
      }
      else {
        this.openSnackBar(`${error.error}`, "X");
      }
      console.log(error);
    }

  }

  async getPermissions() {
    // console.log('user role', this.userRole);
    // if(this.userRole.role === 'Admin')
    // this.userPermissions.push('Dashboard', 'Sales', 'Products','Repairs','Completed Repairs','Inventory','Users','Customers','Customer Orders','Suppliers','Supplier Orders', 'Configuration');
    // else if(this.userRole.role === 'Sales')
    // this.userPermissions.push('Sales', 'Products','Repairs','Completed Repairs','Inventory','Customers','Customer Orders');

    // console.log('user permissions',this.userPermissions);

    try {
      let httpCall = this.http.get<any>(`${API_URL}/UserType/GetAllUserTypes`, this.httpOptions)
      let result = (await lastValueFrom(httpCall));

      for (let i = 0; i < result.length; i++) {
        if (result[i].userTypeName === this.userRole.role) {
          // convert the permissions from string to array
          this.userPermissions = result[i].userPermissions.split(',');
          console.log('user permissions', this.userPermissions);
        }
      }
    }
    catch (error: any) {
      console.log(error);
    }

  }

openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, { panelClass: ['green-snackbar'], duration: 3000});
}

}