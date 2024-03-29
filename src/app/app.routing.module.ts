import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from './auth/auth.guard';

const routes:Routes = [
    {path:'',component:PostListComponent},
    {path:'create-post',component:PostCreateComponent,canActivate:[AuthGuard]},
    {path:'edit-post/:postId',component:PostCreateComponent,canActivate:[AuthGuard]},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent}
]

@NgModule({
    imports : [RouterModule.forRoot(routes)],
    exports : [RouterModule],
    providers : [AuthGuard]
})

export class AppRoutingModule {}