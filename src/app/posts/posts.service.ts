import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor() { }

  getPosts(){
    return [...this.posts];
  }

  getPostsUpdateListner(){
    return this.postsUpdated.asObservable();
  }

  addPost(title:string,content:string){
    const post = {title:title,content:content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
