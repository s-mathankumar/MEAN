import { Component, OnInit ,Input ,OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // posts = [{title:"First",content:"The first post"},
  // {title:"Second",content:"The second post"},
  // {title:"Third",content:"The third post"},
  // {title:"Fourth",content:"The fourth post"}
  // ];
  posts:Post[] = [];
  isLoading:boolean = false;
  postsSize = 0;
  postsPerPage = 2;
  currentPage =1;
  postsPageOptions = [2,4,6,8,10];
  authenticatedUser:boolean = false;
  private postsSubscription = new Subscription;
  private authSubscription = new Subscription;

  constructor(public postsService:PostsService,private router : Router, public authService : AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSubscription = this.postsService.getPostsUpdateListner().
    subscribe((postData:{posts:Post[],postsCount:number})=>{
      this.isLoading = false;
      this.postsSize = postData.postsCount;
      this.posts = postData.posts;
    });
    this.authenticatedUser=this.authService.getUserAuthenticatedStatus();
    this.authService.getAuthLisner().subscribe(isAuthenticated => {
      this.authenticatedUser = isAuthenticated;
    })
  }

  onPageChange(page:PageEvent){
    this.currentPage = page.pageIndex + 1;
    this.postsPerPage = page.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }
  onPostDelete(postId:string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage,this.currentPage);
    });
  }
  onEditPost(postId:string){
    this.isLoading = true;
    this.router.navigate(['/edit-post',postId]);
    // this.router.navigateByUrl('edit-post/'+postId);
  }
  ngOnDestroy(){
    this.postsSubscription.unsubscribe;
  }
}
