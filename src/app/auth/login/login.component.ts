import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading:boolean = false;
  loginValue = "Login"
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm){
    this.loginValue = "Loading..."
    this.authService.onLogin(form.value.email,form.value.password);
  }
}
