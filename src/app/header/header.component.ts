import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authenticatedUser:boolean = false;
  private authListnerSub = new Subscription;
  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.authenticatedUser = this.authService.getUserAuthenticatedStatus();
    this.authListnerSub = this.authService.getAuthLisner().subscribe(isAuthenticated => {
      this.authenticatedUser = isAuthenticated;
    });
  }
  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListnerSub.unsubscribe();
  }
}
