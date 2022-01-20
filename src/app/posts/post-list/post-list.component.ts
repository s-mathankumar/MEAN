import { Component, OnInit ,Input ,OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
  private postsSubscription = new Subscription;
  constructor(public postsService:PostsService,private router : Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostsUpdateListner().subscribe((posts:Post[])=>{
      this.isLoading = false;
      console.log('ngonit',posts);
        this.posts = posts;
    });
  }
  onPostDelete(postId:string){
    this.postsService.deletePost(postId);
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
