import { Component, OnInit } from '@angular/core';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  form: FormGroup;
  user;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      fname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      lname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      detail: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])]

    });
  }

  submit(form){


    this.user ={
      firstName: form.value.fname,
      lastName: form.value.lname,
      email: form.value.email,
      password: '123456',
      detail: form.value.detail
    }

    this.auth.signup(this.user.email, "123456")
      .then(res => {
        this.api.updateAdminData(res.user.uid, this.user)
          .then(Response => {
            this.toastr.success("User Create Successfully!", "Add User");
            this.router.navigate(['/dashboard/home']);
          }, err=>{
            console.log(err);
          });
      });


  }

}
