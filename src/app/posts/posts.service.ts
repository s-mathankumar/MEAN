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

  getPost(id:string){
    console.log(id);
    return this.http.get<{post:Post}>("http://localhost:3000/posts/"+id);
  }

  addPost(title:string,content:string){
    const post = {id:'',title:title,content:content};
    this.http.post<{message:string,postId:string}>("http://localhost:3000/posts", post).
    subscribe((postdata) =>{
      const id = postdata.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId:string){
    console.log(postId);
    this.http.delete("http://localhost:3000/posts/"+postId).
    subscribe((message) => {
      console.log(message);
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
  updatePost(id:string,title:string,content:string){
    console.log(id);
    const post = {
      id : id,
      title : title,
      content : content
    }
    this.http.put("http://localhost:3000/posts/"+id,post).subscribe((response) => {
        console.log(response);
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
    });
  }
}
