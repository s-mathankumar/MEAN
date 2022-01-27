import { Component, OnInit , OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  signupValue = "Signup";
  private loadingStatus = new Subscription;
  constructor(public authService : AuthService) { }

  ngOnInit(): void {
    this.loadingStatus = this.authService.getAuthLisner().subscribe(result => {
      this.signupValue = "Signup";
    })
  }
onSubmit(form:NgForm){
  this.signupValue = "Loading..."
  this.authService.onCreatingUser(form.value.email,form.value.password);
  form.resetForm();
  }
  ngOnDestroy(){
    this.loadingStatus.unsubscribe();
  }
}
