import { AbstractControl } from '@angular/forms';
import { of,Observable,Observer } from 'rxjs';

export const mimeType = 
(control : AbstractControl): Promise <{[key:string]:any} | null> | Observable<{[key:string]:any} | null> => {
    if(typeof(control.value) === 'string'){
        return of(null);
    }
    const file = control.value as File;
    const fileRdr = new FileReader();
    const fileObs = Observable.create((observer:Observer<{[key:string]:any} | null>) => {
        fileRdr.addEventListener("loadend",() => {
            const arr = new Uint8Array(fileRdr.result as ArrayBuffer).subarray(0,4);
            let header = " ";
            let valueValid:boolean = false;
            for (let i=0;i<arr.length;i++){
                header += arr[i].toString(16);
                header = header.trim();
            }
            console.log("header",header);
            if(header == '89504e47'){
                console.log("checking true");
            }
            switch (header){
                case "89504e47":
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    valueValid = true;
                    break;
                default:
                    valueValid = false;
                    break;
            }
            if(valueValid){
                observer.next(null);
                console.log("from if block : valid");
            }else{
                console.log("from if block invalid");
                console.log(valueValid);
                observer.next({validMime:false});
            }
            observer.complete();
        });
        fileRdr.readAsArrayBuffer(file);
    });
    return fileObs;
};