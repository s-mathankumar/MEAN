import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//import { formatCurrency } from '@angular/common';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from '../post-list/mimeType-validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle: string = '';
  enteredContent: string = '';
  form! : FormGroup;
  private mode: string = 'create';
  private postId: any;
  post: any;
  isLoading: boolean = false;
  imagePreview:any;
  //@Output() postCreated = new EventEmitter();
  constructor(public postsService: PostsService, private activateRoute: ActivatedRoute, private router: Router,
    private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title : new FormControl(null,{
        validators:[Validators.required, Validators.minLength(3)]}),
      content : new FormControl(null,{
        validators:[Validators.required]}),
      image : new FormControl(null,
        {validators:[Validators.required],asyncValidators:[mimeType]})
    });

    this.activateRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        //this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.post = post;
          this.form.setValue({
            title : this.post.title,
            content : this.post.content,
            image : this.post.imagePath
          })
        })
        //console.log(this.post);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  onImageUpload(event:Event){
    // console.log(event);
    const fileRef = (event.target as HTMLInputElement).files;
    const file = fileRef?.[0] as File;
    this.form.patchValue({image:file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  savePost() {
    console.log(this.form);
    if (this.form.invalid){
      console.log("invalid");
      return;
    }else{
      console.log("valid");
    }
    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPost(
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
        );
      // this.router.navigate(['/']);
    } else {
      this.postsService.updatePost(
        this.postId, 
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
    //this.postCreated.emit(posts);
  }
}
