import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupValue = "Signup";
  constructor(public authService : AuthService) { }

  ngOnInit(): void {
  }
onSubmit(form:NgForm){
  this.signupValue = "Loading..."
  this.authService.onCreatingUser(form.value.email,form.value.password);
  }
}
