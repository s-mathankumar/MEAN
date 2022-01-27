import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading:boolean = false;
  loginValue = "Login"
  private loadingStatus = new Subscription;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.loadingStatus = this.authService.getAuthLisner().subscribe(result => {
      this.loginValue = "Login";
    });
  }
  onSubmit(form:NgForm){
    this.loginValue = "Loading..."
    this.authService.onLogin(form.value.email,form.value.password);
    form.resetForm();
  }
  ngOnDestroy(){
    this.loadingStatus.unsubscribe();
  }
}
