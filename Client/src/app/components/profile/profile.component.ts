 import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';
import { ResponseModel } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  myUser: any;

  constructor(
    private userService: UserService,
    private authService: SocialAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map((user: SocialUser | ResponseModel) =>{
          if(user instanceof SocialUser){
            return{
              ...user,
              email: 'test@test.com',
            };
          } else{
            return user;
          }
        })
      )
      .subscribe((data: SocialUser | ResponseModel ) =>{
        this.myUser = data;
      });
  }

  logout(){
    this.userService.logout();
  }

}
