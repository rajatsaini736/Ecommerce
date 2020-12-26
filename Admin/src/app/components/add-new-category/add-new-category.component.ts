import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.css']
})
export class AddNewCategoryComponent implements OnInit {

  catTitle : string;
  catDescription: string;
  hasError : boolean;
  success : boolean;
  errorMessage : string;

  constructor(
    private categoryService : CategoryService
  ) { }

  ngOnInit(): void {
    this.hasError = false;
  }

  addCategory(){
    this.categoryService.addCategory(this.catTitle, this.catDescription)
      .subscribe((res) =>{
        if(res.status == "success"){
            this.success = true;
            this.errorMessage = res.message;
            this.catTitle = "";
            this.catDescription ="";
        }
        if(res.status == "failure"){  
            this.hasError = true;
            this.errorMessage = res.message;
        }
      });
  }

}
