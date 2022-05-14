import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
} from '@angular/common/http';
import { Subscription } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-material-file-upload',
  templateUrl: './material-file-upload.component.html',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MaterialFileUploadComponent implements OnInit {
  /** Link text */
  @Input() text = 'Upload';
  @Input() icon = 'file_upload';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'File';
  /** Target URL for file uploading. */
  @Input() target = 'File';
  /** Input color for file upload. By default – primary */
  @Input() color = 'primary';
  @Input() multiple = true;
  /** File extension that accepted, same as 'accept' of <input type="file" />.
   * By the default, it's set to 'image/*'.
   */
  @Input() accept = 'image/*,.pdf,.doc,.docx,.xlsx';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() uploadComplete = new EventEmitter<string>();

  files: Array<FileUploadModel> = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

  onClick(fileUpload: HTMLInputElement): void {
    // const fileUpload = document.getElementById(
    //   'fileUpload'
    // ) as HTMLInputElement;
    fileUpload.onchange = () => {
     Array.from(fileUpload.files).forEach(file => {
       this.files.push({
         data: file,
         state: 'in',
         inProgress: false,
         progress: 0,
         canRetry: false,
         canCancel: true,
       });
     });
     this.uploadFiles(fileUpload);
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel): void {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel): void {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel): void {
    const fd = new FormData();
    fd.append(this.param, file.data);

    const req = new HttpRequest('POST', environment.baseURI + this.target, fd, {
      reportProgress: true,
    });

    file.inProgress = true;
    file.sub = this.httpClient
      .request(req)
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        tap(() => {}),
        last(),
        catchError(() => {
          file.inProgress = false;
          file.canRetry = true;
          return of(`${file.data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          this.removeFileFromArray(file);
          this.uploadComplete.emit(event.body);
        }
      });
  }

  private uploadFiles(fileUpload: HTMLInputElement): void {
    // const fileUpload = document.getElementById(
    //   'fileUpload'
    // ) as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach((file) => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel): void {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
