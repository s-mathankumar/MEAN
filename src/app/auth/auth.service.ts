import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { authModel } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token:string | undefined | null;
  isUserAuthenticated:boolean = false;
  authListner = new Subject<boolean>();
  timer:any;
  constructor(private http:HttpClient,public router : Router) { }

  getToken(){
    return this.token;
  }
 getUserAuthenticatedStatus(){
  return this.isUserAuthenticated;
 }

  getAuthLisner(){
    return this.authListner.asObservable();
  }

  onCreatingUser(email:string,password:string){
    const authData:authModel = {email:email,password:password};
    this.http.post("http://localhost:3000/user/signup",authData)
    .subscribe(response => {
      console.log(response);
      this.router.navigate(['/']);
    }
    )
  }

  onLogin(email:string,password:string){
    const authData:authModel = {email:email,password:password};
    this.http.post<{token:string,expiresIn:number}>("http://localhost:3000/user/login",authData)
    .subscribe(response => {
      const responseData = response.token;
      this.token = responseData;
      if(this.token){
        const timeoutValue = response.expiresIn;
        this.setAuthTimer(timeoutValue);
        this.isUserAuthenticated = true;
        this.authListner.next(true);
        const now = new Date();
        const expirationTime = new Date(now.getTime() + timeoutValue * 1000);
        console.log(expirationTime);
        this.setLocalToken(this.token,expirationTime);
        this.router.navigate(['/']);
      }
    });
  }

  logout(){
    this.token = null;
    this.isUserAuthenticated = false;
    this.authListner.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.timer);
    this.clearLocalToken();
  }

  private setLocalToken(token:string,expirationtime:Date){
    localStorage.setItem("token",token);
    localStorage.setItem("expirationTime",expirationtime.toISOString());
  }

  private clearLocalToken(){
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
  }
  private setAuthTimer(duration:number){
    setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthenticateUser(){
    const authInfo = this.getLocalToken();
    const now = new Date();
    const ExpirationValue = authInfo!.expirationDate.getTime() - now.getTime(); //! non null assertion
    if(ExpirationValue > 0){
      this.token = authInfo?.token;
      this.setAuthTimer(ExpirationValue / 1000);
      this.isUserAuthenticated = true;
      this.authListner.next(true);
    }  
  }

  private getLocalToken(){
    const token = localStorage.getItem("token");
    const expirationTime:string | null = localStorage.getItem("expirationTime");
    if(!token || !expirationTime){
      return 
    }
     return { 
      token:token,
      expirationDate : new Date(expirationTime)
      
    }
  }
}
