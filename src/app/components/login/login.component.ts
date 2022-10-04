import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  invalidLogin!: boolean;
  users: any = [];
  public showPass: boolean = false;

  @ViewChild('password')
  public password!: ElementRef;


  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    //checks if user is logged in (has a valid token): if true does not require login, else login page loaded
    this.authService.isUserAuthenticated();
  }

  // validateUser() {
  //   this.http.get(`${API_URL}/User/GetAllUsers`)
  //     .subscribe(results => {
  //       this.users = results;

  //       for (let user of this.users) {
  //         try {
  //           if (this.loginForm.value.password == user.UserHashedPassword && this.loginForm.value.email == user.UserEmail) {
  //             this.router.navigate(["/users"]);
  //           }
  //         } catch (error) {
  //           this.router.navigate(["/"]);
  //         }
  //       }
  //     })
  // }

  async loginUser(loginForm: any) {
    const credentials = {
      email: loginForm.value.email,
      password: loginForm.value.password
    }

    await this.authService.LoginUser(credentials)
  }

  showHide() {
    let x = this.password.nativeElement;
    if (x.type === "password") {
      x.setAttribute('type', "text")
      this.showPass = false
    } else {
      x.setAttribute('type', "password")
      this.showPass = true
    }
  }

}

function HostListeners(arg0: string) {
  throw new Error('Function not implemented.');
}
