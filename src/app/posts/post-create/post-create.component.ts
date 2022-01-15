import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
//import { formatCurrency } from '@angular/common';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle: string = '';
  enteredContent: string = '';
  //@Output() postCreated = new EventEmitter();
  constructor(public postsService : PostsService) { }

  ngOnInit(): void {
  }
  addPost(postForm: NgForm){
    if (postForm.invalid)
      return;
    this.postsService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
    //this.postCreated.emit(posts);
  }
}
