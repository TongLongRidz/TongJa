import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";

export interface DecodedToken {
  exp: number;
  firstName: string;
  iat: number;
  id: number;
  lastName: string;
  profileCode: string;
  sub: string;
  roles: string[];
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly tokenName: string = "accessToken";

  isLoggedIn$ = this._isLoggedIn$.asObservable();

  private booleanSubject = new BehaviorSubject<boolean>(false);
  boolean$ = this.booleanSubject.asObservable();

  constructor() {
    this._isLoggedIn$.next(!!this.getToken());
  }

  saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  }

  decodeTokenJWT(token: string): DecodedToken | null {
    return new JwtHelperService().decodeToken(token);
  }

  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(this.tokenName);
  }

  isAuthen(_token: string | null): boolean {
    let token =
      null != _token && "" != _token && _token != undefined ? _token : this.getToken();
    if (!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  setStatusLogin(value: boolean): void {
    this.booleanSubject.next(value);
  }

  hasRole(requiredRoles: string[]): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = this.decodeTokenJWT(token);
      const userRoles: string[] = decodedToken.roles || [];
      return userRoles.some((role) => requiredRoles.includes(role));
    }
    return false;
  }

  onEditRole(prCode: string, role: string) {
    const token = this.getToken();
    if (token) {
      let decodedToken: any = this.decodeTokenJWT(token);
      if (
        decodedToken &&
        prCode === decodedToken.profileCode &&
        role !== decodedToken.roles[0]
      ) {
        this.clearToken();
      }
    }
  }
}
