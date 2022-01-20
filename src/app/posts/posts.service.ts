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
          id:post._id,
          imagePath:post.imagePath
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

  addPost(title:string,content:string,image:File){
    // console.log("in save post");
    // const post = {id:'',title:title,content:content};
    const postData = new FormData;
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image,title);
    this.http.post<{message:string,post:Post}>("http://localhost:3000/posts", postData).
    subscribe((responseData) =>{
      const post:Post = {
        id:responseData.post.id,
        content:content,
        title:title,
        imagePath:responseData.post.imagePath
      };
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
  updatePost(id:string,title:string,content:string,image : File | string){
    let postData:Post | FormData ;
    if(typeof(image) === "object"){
      postData = new FormData;
      postData.append("id",id);
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image",image,title)
    }else{
      postData = {
        id:id,
        title:title,
        content:content,
        imagePath:image
      }
    }
    this.http.put("http://localhost:3000/posts/"+id,postData).subscribe((response) => {
        console.log(response);
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
    });
  }
}
