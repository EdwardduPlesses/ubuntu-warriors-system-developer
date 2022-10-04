import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})

export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  invalidChangePassword!: boolean;
  users: any = [];

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.changePasswordForm = this.fb.group({
      email: ['', Validators.required],
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
          ),
        ],
      ],
    });
  }

  async ngOnInit() {
    //get current user email using token
    await this.authService.getcurrentUserEmail();
    this.changePasswordForm.controls['email'].setValue(
      await this.authService.currentUserEmail.unique_name
    );
  }

  async ChangePassword() {
    if (
      this.changePasswordForm.controls['newPassword'].valid &&
      this.changePasswordForm.controls['confirmPassword'].valid
    ) {
      if (
        this.changePasswordForm.controls['newPassword'].value ==
        this.changePasswordForm.controls['confirmPassword'].value
      ) {
        //user email, old password, and new password information
        const changePwdInfo = {
          email: this.changePasswordForm.value.email,
          oldPassword: this.changePasswordForm.value.oldPassword,
          newPassword: this.changePasswordForm.value.newPassword,
        };
        await this.authService.changePassword(changePwdInfo).finally(() => { this.router.navigate(['']) });
      } else {
        this.openSnackBar('Passwords do not match', 'X');
      }
    } else {
      this.openSnackBar(
        'Please enter a valid password: \n minimum 8 characters',
        'X'
      );
    }
  }

  async openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { panelClass: ['green-snackbar'], duration: 3000 });
  }
}