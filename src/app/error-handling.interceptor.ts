import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error/error.component';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(public dialog : MatDialog) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse) => {
        let errorMessage = "An unkown error";
        if(error.error.message){
          errorMessage = error.error.message;
        }
        let dialogRef = this.dialog.open(ErrorComponent,{
          width:'350px',
          height:'auto',
          data : {message : errorMessage}
        });
        return throwError(error)
    })
    );
  }
}
