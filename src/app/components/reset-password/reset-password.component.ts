import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    public authService: AuthService,
    public fb: FormBuilder,
    private snackBar: MatSnackBar
    ) {
      this.resetPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        otp: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
        )]],
        confirmPassword: ['', [Validators.required, Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
        )]]
      });
     }

  ngOnInit(): void {
  }

  async resetPassword() {
    //trigger the progress bar for otp
    this.authService.otpPending = true;

    if(this.resetPasswordForm.controls['email'].valid) {
    const email = this.resetPasswordForm.value.email;
    this.authService.sendOTP(email);
    }
    else{
      this.openSnackBar('Please enter a valid email','X')
      this.authService.otpPending = false;
    }
  }
  async ChangePassword(){
    if(this.resetPasswordForm.controls['newPassword'].valid && this.resetPasswordForm.controls['confirmPassword'].valid){
      if (this.authService.confirmedOTP) {
        if(this.resetPasswordForm.controls['newPassword'].value == this.resetPasswordForm.controls['confirmPassword'].value){
          const newPassword = this.resetPasswordForm.value.newPassword;
          this.authService.resetPassword(newPassword);
        }
        else{
          this.openSnackBar('Passwords do not match','X')
        }
      }
    }
    else{
      this.openSnackBar('Please enter a valid password: \n minimum 8 characters','X')
    }

  }

  async openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {duration: 3000});
  }
}