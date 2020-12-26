import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryServerModel, CategoryServerResponse } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.css']
})
export class AllCategoriesComponent implements OnInit {

  cats : CategoryServerModel[];
  errorMessage : string;
  hasError : boolean;
  success : boolean;
  subs : Subscription[] = [];

  constructor(
    private categoryService : CategoryService
  ) { }

  ngOnInit(): void {
    this.hasError = false;
    this.subs.push(    this.categoryService.getAllCategories()
    .subscribe((res: CategoryServerResponse) => {
      this.cats = res.categories;
    }));
  }

  ngOnDestroy(): void{
    this.subs.map((s) => s.unsubscribe());
  }

  deleteCategory(id: number){
    this.subs.push(
      this.categoryService.deleteCategory(id)
      .subscribe((res) => { 
        // console.log(res);
        if(res.status == "failure"){
          this.hasError = true;
          this.errorMessage = res.message;
        }
        if( res.status == "success"){
          this.success = true;
          this.errorMessage = res.message;
        }
        this.cats = res.categories;
      })
    );
  }

}
