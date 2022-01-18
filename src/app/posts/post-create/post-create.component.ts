import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
//import { formatCurrency } from '@angular/common';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle: string = '';
  enteredContent: string = '';
  private mode: string = 'create';
  private postId: any;
  post: any;
  isLoading: boolean = false;
  //@Output() postCreated = new EventEmitter();
  constructor(public postsService: PostsService, private activateRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        //this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.post = post;
          console.log(post)
        })
        //console.log(this.post);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  savePost(postForm: NgForm) {
    if (postForm.invalid)
      return;
    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPost(postForm.value.title, postForm.value.content);
      this.router.navigate(['/']);
    } else {
      this.postsService.updatePost(this.postId, postForm.value.title, postForm.value.content);
      this.router.navigate(['/']);
    }
    postForm.resetForm();
    //this.postCreated.emit(posts);
  }
}
