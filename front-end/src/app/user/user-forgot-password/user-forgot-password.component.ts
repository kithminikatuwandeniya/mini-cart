import { Component, OnInit } from '@angular/core';
import { ResetPasswordService } from "../services/reset-password.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import AppError from "../../errors/app-error";

@Component({
  selector: 'app-user-forgot-password',
  templateUrl: './user-forgot-password.component.html',
  styleUrls: ['./user-forgot-password.component.css',
    '../user-style.css']
})
export class UserForgotPasswordComponent implements OnInit {
  done: boolean;
  doneCode: boolean;
  donePassword:boolean;
  forgotSubscription: Subscription;
  userErrors: Map<string, string> = new Map<string, string>();
  load = false;
  loadcode = false;
  loadPassword = false;
  email = "";

  constructor(private resetPasswordService: ResetPasswordService,
    public router: Router) {
  }

  ngOnInit() {
  }

  forgotPassword(data: any) {
    this.load = true;

    this.forgotSubscription = this.resetPasswordService.sendResetPasswordToken(data.email)
      .subscribe(response => {
        this.done = true;
      }, (appError: AppError) => {
        if (appError.status === 404) {
          this.userErrors['email'] = 'User with this email doesn\'t exist';
        } else {
          throw appError;
        }
        this.load = false;
      });
  }

  codeValidate(data: any) {
    this.loadcode = true;
    this.forgotSubscription = this.resetPasswordService.validateToken(data.emailReset, data.codeReset)
      .subscribe(response => {
        this.doneCode = true;
        this.email = data.emailReset;
      }, (appError: AppError) => {
        if (appError.status === 404) {
          this.userErrors['code-reset'] = 'User with this email doesn\'t exist';
        }
        else if (appError.status === 403) {
          this.userErrors['code-reset'] = 'Invalid Code';
        }
        else {
          throw appError;
        }
        this.loadcode = false;
      });
  }

  changePassword(data: any) {
    this.loadPassword = true;
    if (data.password == data.passwordRe) {
      this.forgotSubscription = this.resetPasswordService.changePassword(data.password, data.passwordRe,this.email)
        .subscribe(response => {
          this.donePassword = true;
        }, (appError: AppError) => {
          if (appError.status === 500) {
            this.userErrors['password-errors'] = 'Internal server error';
          }
          else {
            throw appError;
          }
          this.loadPassword = false;
        });
    } else {
      this.userErrors['password-errors'] = 'Password and re-type password not matching.';
      this.loadPassword = false;
    }
  }

}
