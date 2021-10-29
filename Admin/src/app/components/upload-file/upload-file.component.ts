import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  file: File = null;
  id: String = '';

  constructor(
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  onChangeLink(event) {
    this.id = event.target.value.split('/')[5];
  }

  async uploadFile() {
    const formData = new FormData();
    formData.append('file', this.file);
    // formData.append("upload_preset", "por1xdcz");
    // formData.append("cloud_name", "dnzmnhq0a");
    // formData.append("folder", "transcripts");
    console.log(this.file);
    console.log(formData);
    // let res = await this._userService.uploadUserDoc(formData);
    this._http.post(`http://localhost:3000/api/upload`, formData).subscribe((res) => {
      console.log(res);
    });
    // this._http.post(`https://www.googleapis.com/upload/drive/v3/files?uploadType=media`, formData).subscribe((res) => {
    //   console.log(res);
    // });
    // this._http.post(`https://file.io`, formData).subscribe((res) => {
    //   console.log(res);
    // })  
    // this._http.post(`https://api.cloudinary.com/v1_1/dnzmnhq0a/auto/upload`, formData).subscribe((res) => {
    //   console.log(res);
    // })

  }

  async uploadLink() {
    this._http.post(`http://localhost:3000/api/upload/copy-link`, { copy_id: this.id }).subscribe((res) => {
      console.log(res);
    })
  }
}
