import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
//import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'Project1';
  // storedPosts:Post[]=[];

  // onAddPosts(posts:any){
  //   this.storedPosts.push(posts);
  // }
  constructor(public authService : AuthService) {}
  ngOnInit(){
      this.authService.autoAuthenticateUser();
    }
  }

