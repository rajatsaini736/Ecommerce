import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { throwError } from 'rxjs';
import { CategoryServerModel, CategoryServerResponse } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
const uploadUrl = '/assets/img';

declare var $: any;

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})

export class AddNewProductComponent implements OnInit {

  @ViewChild('imageFile') inputVar;

  productTitle: string;
  productDescription: string;
  productCategory: number;
  productShortDesc: string;
  productPrice: number;
  productQuantity: number;
  productImage: string;

  hasError : boolean;
  success : boolean;
  errorMessage : string;

  imgError: boolean;
  imgSuccess: boolean;
  imgMessage: string;

  imgsError: boolean;
  imgsSuccess: boolean;
  imgsMessage: string;

  cats : CategoryServerModel[] = [];

  filePath = "assets/img/";

  selectedImgPath: string;
  
  imageToUpload: string;
  imagesToUpload: string;
  
  imageToSave: string;
  imagesToSave: any[]=[];

  constructor(
    private productService : ProductService,
    private categoryService : CategoryService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.hasError = this.success = this.imgError = this.imgsError = this.imgSuccess = this.imgsSuccess = false;

    this.categoryService.getAllCategories()
      .subscribe((catArr : CategoryServerResponse) => {
        this.cats = catArr.categories;
      });
  }

  handleFileInput(event){
    this.imageToSave = event.target.files[0];
    this.selectedImgPath = event.target.files[0].name;
    document.getElementById('labelProductImage').innerHTML = this.selectedImgPath;
    
    this.imageToUpload = this.filePath.concat(this.selectedImgPath);  
  }

  handleFilesInput(event){
    let imgsPathDisplay: any[] = [];
    let tempUploadImgs: any[] = [];
    let selectedImgsPath: any[] = [];

    // GETTING FILE NAME AND CONTENT
    this.imagesToSave = event.target.files;
    [...this.imagesToSave].forEach((img) => {
      selectedImgsPath.push(img.name);
      tempUploadImgs.push(this.filePath.concat(img.name));
    });

    // DISPLAYING SELECTED FILE NAME IN DOM
    imgsPathDisplay = selectedImgsPath;
    document.getElementById('labelProductImages').innerHTML = imgsPathDisplay.join(',');

    //APPENDING THE FOLDER PATH TO STORE IT IN DB
    this.imagesToUpload = tempUploadImgs.join(',');
  }

  onSubmit(){
    document.getElementById('labelProductImage').innerHTML = "";
    document.getElementById('labelProductImages').innerHTML = "";
    

    //  POSTING NEW PRODUCT
    this.productService.addProduct(this.productCategory, this.productTitle, this.productQuantity, this.productDescription, this.productShortDesc, this.imageToUpload, this.imagesToUpload, this.productPrice)
      .subscribe((res) => {
        if (res.status == "failure"){
          this.hasError = true;
          this.errorMessage = res.message;
        }
        if ( res.status = "success"){
          this.success = true;
          this.errorMessage = res.message;

          //SAVE THE IMAGE
          const formData1 = new FormData();
          formData1.append('file', this.imageToSave);

          this.productService.uploadImage(formData1)
            .subscribe((res: {status: string, message: string}) =>{
              if(res.status == "success"){
                this.imgSuccess = true;
                this.imgMessage = res.message;
              }else{
                this.imgError = true;
                this.imgMessage = res.message;
              }
            }, (err) =>{
              this.imgError = true;
              this.imgMessage = "Failed to upload image";
            });

          //SAVE THE IMAGES
          if(this.imagesToUpload){

            // GENEREATING FORMDATA TO SEND FILES OVER THE SERVER
            const formData2 = new FormData();
            for(let img of this.imagesToSave){
              formData2.append('files',img);
            }

            this.productService.uploadImages(formData2)
              .subscribe((res: {status: string, message:string}) =>{
                if(res.status == "success"){
                  this.imgsSuccess = true;
                  this.imgsMessage = res.message;
                }else{
                  this.imgsError = true;
                  this.imgsMessage = res.message;
                }
              }, (err) =>{
                this.imgsError = true;
                this.imgsMessage = "Failed to upload images";
              })
            this.imagesToUpload = undefined;
            this.imagesToSave = []; 
          }
        }
      });
    this.hasError = this.success = this.imgError = this.imgsError = this.imgSuccess = this.imgsSuccess = false;
  }
}

