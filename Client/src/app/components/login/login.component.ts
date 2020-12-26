import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  errorMessage: string;

  constructor(
    private authService:SocialAuthService,
    private router: Router,
    private userSerivce: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userSerivce.authState$.subscribe((authState : boolean) =>{
      if(authState){
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
      } else{
        this.router.navigateByUrl('/login');
      }
    })

    this.userSerivce.errorMessage$.subscribe((error: string) => {
      this.errorMessage = error;
    })
  }

  login(form: NgForm){
    const email = this.email;
    const password = this.password;

    if(form.invalid){
      return;
    }

    form.reset();
    this.userSerivce.loginUser(email, password);
  }

  signInWithGoogle(){
    this.userSerivce.googleLogin();
  }
}
