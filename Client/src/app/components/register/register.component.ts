import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email : string;
  password : string;
  fname : string;
  lname : string;
  errorMessage : string;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.errorMessage$.subscribe((error: string) => {
      this.errorMessage = error;
    });
  }

  register(form: NgForm){
    let email = this.email;
    let password = this.password;
    let fname = this.fname;
    let lname = this.lname;
    if(form.invalid){
      return ;
    }
    
    form.reset();
    this.userService.registerUser(email, password, fname, lname);
  }
}
