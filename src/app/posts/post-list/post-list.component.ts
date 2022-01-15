import { Component, OnInit ,Input ,OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

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
  private postsSubscription = new Subscription;
  constructor(public postsService:PostsService) { }

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostsUpdateListner().subscribe((posts:Post[])=>{
        this.posts = posts;
    });
  }
  ngOnDestroy(){
    this.postsSubscription.unsubscribe;
  }
}
