import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http : HttpClient) { }

  getPosts(){
    // return [...this.posts];
    this.http.get("http://localhost:3000/posts").
    pipe(map((postData:any) => {
      return postData.posts.map((post:any) =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id
        }
      });
    })).
    subscribe(transformPosts => {
      this.posts = transformPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostsUpdateListner(){
    return this.postsUpdated.asObservable();
  }

  addPost(title:string,content:string){
    const post = {id:'',title:title,content:content};
    this.http.post<{message:string}>("http://localhost:3000/posts", post).
    subscribe((postdata) =>{
      console.log(postdata.message); 
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
