import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth: boolean = false;
  errM: string = "";
  private SERVER_URL : string = environment.ROOT_URL;
  private user;
  private userDataClient: userDataPublic = {
    id: 0,
  };
  private userDataServer: userDataServer = {
    auth: false,
    id: 0,
    email: '',
    name: '',
    fname: '',
    lname: ''
  };

  //Observable
  authState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
  userData$: BehaviorSubject<SocialUser | userDataServer> = new BehaviorSubject<SocialUser | ResponseModel>(null);
  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  
  constructor(
    private authService: SocialAuthService,
    private httpClient: HttpClient,
  ) {
      this.authState$.next(this.userDataServer.auth);
      this.userData$.next(this.userDataServer);

      //GET THE INFO FROM LOCAL STORAGE (if any)
      let info: ResponseModel = JSON.parse(localStorage.getItem('user'));

      if(info != null && info != undefined && info.id != 0){
        this.userDataClient = info;

        this.getSingleUser(this.userDataClient.id)
          .subscribe((data: singleUserResponse) =>{
            if( this.userDataServer.id == 0 && this.userDataServer.email == ''){
              this.userDataServer = data.user;
            }
            this.auth = true;
            this.authState$.next(this.auth);
            this.userDataClient.id = this.userDataServer.id;
            localStorage.setItem('user', JSON.stringify(this.userDataClient));
            this.userData$.next(this.userDataServer);
          });
      }

      this.authService.authState.subscribe((user: SocialUser) => {
        if( user != null ){
          this.auth = true;
          this.authState$.next(this.auth);
          this.userData$.next(user);
          this.errorMessage$.next(null);
        }
      });
    }
      //login user with email and password
      loginUser(email: string, password: string){
        this.httpClient.post(`${this.SERVER_URL}/auth/login`, { email, password })
          .subscribe((data: ResponseModel) =>{

            if(data.errors){
              this.errM = data.errors;
              this.errorMessage$.next(this.errM);
            } else{
              this.auth = data.auth;
              this.userDataServer = data;

              this.userDataClient.id = this.userDataServer.id;
              localStorage.setItem('user',JSON.stringify(this.userDataClient));
              this.userData$.next(this.userDataServer);
              this.authState$.next(this.auth);
              // this.authState$.next(this.auth);
              // this.userData$.next(data);
            }
           }
          );
      }

      registerUser(email: string, password: string, fname: string, lname: string){
        this.httpClient.post(`${this.SERVER_URL}/auth/register`,{ email, password, fname, lname })
        .subscribe((data: ResponseModel) =>{
          if(data.errors){
            this.errM = data.errors;
            this.errorMessage$.next(this.errM);
          }
          else{
            this.auth = data.auth;
            this.authState$.next(this.auth);
            this.userData$.next(data);
            console.log(data);
          }
        })
      }

      getSingleUser(id: number){
        return this.httpClient.get(`${this.SERVER_URL}/users/${id}`);
        // this.httpClient.get(`${this.SERVER_URL}/users/${id}`)
        //   .subscribe((data: singleUserResponse) =>{
        //     if(data.user){
        //       this.auth = true;
        //       this.authState$.next(this.auth);
        //       this.userDataServer = data.user;
        //       this.userData$.next(this.userDataServer);
        //     }
        //   })
      }

      //google authentication
      googleLogin(){
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
      }

      logout(){
        this.authService.signOut();
        this.auth = false;
        this.authState$.next( this.auth );
        this.userDataServer = {auth: false, id: 0, email: '', name: '', fname: '', lname: ''};
        this.userDataClient.id = this.userDataServer.id;
        localStorage.removeItem('user');
      }
}

export interface ResponseModel{
  errors : string;
  errorArr : string[][];
  token: string;
  auth: boolean;
  id: number;
  email: string;
  name: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
}

export interface userDataPublic{
  id: number;
}

export interface userDataServer{
  auth: boolean;
  id: number;
  email: string;
  name: string;
  fname: string;
  lname: string;
}

export interface singleUserResponse{
  user: ResponseModel;
  message: string;
}