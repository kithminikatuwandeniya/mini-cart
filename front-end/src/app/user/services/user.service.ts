import {
  EventEmitter,
  Inject,
  Injectable,
  Output,
  Directive,
} from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import AppError from "../../errors/app-error";
import { User } from "../../models/user.model";
import { ResetPassword } from "../../models/resetPassword.model";

@Directive()
@Injectable({
  providedIn: "root",
})
export class UserService {
  @Output()
  change: EventEmitter<any> = new EventEmitter();

  refreshUsername(user: User): void {
    this.change.emit(user);
    sessionStorage.setItem("username", user.firstName + " " + user.lastName);
  }

  constructor(
    @Inject("BASE_API_URL") private baseUrl: string,
    private http: HttpClient
  ) {}

  update(user: User): Observable<any> {
    return this.http
      .put<User>(this.baseUrl + "/users/me", user, { observe: "response" })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new AppError(error));
        })
      );
  }

  updatePassword(data: ResetPassword): Observable<any> {
    return this.http
      .put<User>(this.baseUrl + "/users/update-password", data, {
        observe: "response",
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new AppError(error));
        })
      );
  }

  delete(id: bigint): Observable<any> {
    return this.http
      .delete<User>(this.baseUrl + "/users/" + id, { observe: "response" })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new AppError(error));
        })
      );
  }

  getCurrentUser(): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + "/user/me", {
        account_id: sessionStorage.getItem("account_id"),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new AppError(error));
        })
      );
  }

  public activateUser(token: string): Observable<any> {
    return this.http
      .post(this.baseUrl + "/users/confirmation?emailUUID=" + token, {
        observe: "response",
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new AppError(error));
        })
      );
  }
}
