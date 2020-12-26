import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryServerModel, CategoryServerResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  readonly SERVER_URL;
  constructor(
    private http: HttpClient
  ) { 
    this.SERVER_URL = environment.ROOT_URL;
  }

  getAllCategories():Observable<CategoryServerResponse>{
    return this.http.get<CategoryServerResponse>(`${this.SERVER_URL}/categories`);
  }

  deleteCategory(id: number):Observable<deleteCatServerResponse>{
    return this.http.delete<deleteCatServerResponse>(`${this.SERVER_URL}/categories/delete/${id}`)
      .pipe(
        switchMap( async(data) => {
          const cats : CategoryServerResponse = await this.getAllCategories().toPromise();
          return {
            ...data,
            ...cats
          };
        })
      );
  }

  addCategory(title: string, description: string):Observable<addCatServerResponse>{
    return this.http.post<addCatServerResponse>(`${this.SERVER_URL}/categories/add`, {
      catTitle: title,
      catDescription: description
    });
  }

}

interface deleteCatServerResponse{
  status: string;
  message: string;
  categories : CategoryServerModel[];
}

interface addCatServerResponse{
  status: string;
  message: string;
}