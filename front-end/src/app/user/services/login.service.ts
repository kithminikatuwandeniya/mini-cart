import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LoginUser} from '../../models/loginUser.model';
import {Observable, throwError} from 'rxjs';
import AppError from '../../errors/app-error';
import {catchError} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(@Inject('BASE_API_URL') private baseUrl: string,
              private http: HttpClient,
              private jwtHelper: JwtHelperService) {
  }

  login(user: LoginUser): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/sign-in', user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(new AppError(error));
        })
      );
  }

  logout(): void {
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired();
  }
}
