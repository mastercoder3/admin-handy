import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import {ApiService} from './../../services/api.service';
import {AuthService} from './../../services/auth.service';
import {HelperService} from './../../services/helper.service';
import {map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error: boolean=false;
  errMsg;
  user;
  femail;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private helper: HelperService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if(localStorage.getItem('aid'))
    {
      this.router.navigate(['/dashboard/home']);
    }
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(email, password, content){
    if(localStorage.getItem('aid')){
        localStorage.removeItem('aid');
        localStorage.removeItem('privilegeType');
      }
      if(email.startsWith('master',0))
      {
        this.api.getMasterAdmin(email,password)
          .pipe(map(actions => actions.map(a=>{
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return{id, ...data};
          })))
            .subscribe(res =>{
              this.user = res;
              if(this.user[0].email.startsWith('master',0)){
                localStorage.setItem('aid',this.user[0].id);
                localStorage.setItem('privilegeType','MASTER');
                this.router.navigate(['/dashboard'])
              }
            })
      }

      else {

    this.auth.login(email,password)
      .then(res =>{
        if(res.user.emailVerified === true){
        this.auth.setPersistance().then(() => {
          this.api.getAdminData(res.user.uid)
          .subscribe(data =>{
              if(data){
                localStorage.setItem('aid', res.user.uid);
                localStorage.setItem('privilegeType','ADMIN');
                this.router.navigate(['/dashboard/home']);
              }
              else{
                this.error = true;
                this.errMsg ='Login Failed';
              }
             });
        });     
      }
      else if (res.user.emailVerified === false){
         this.helper.openModel(content);
      }

      }, err =>{
        this.error = true;
        this.errMsg = err;
      })
    }
  }

  resend(){
    this.auth.sendVerificationEmail()
      .then(data =>{
         this.helper.closeModel();
          this.toastr.success('Verification', 'Email Sent! Check your inbox.');
      }, err=>{
        this.toastr.error('Error!', 'Email not Sent!');
      });
  }

  forgotPass(content){
    this.helper.openModel(content);
  }

  verify(){
    this.auth.forgotPassword(this.femail)
    .then(data =>{
        this.toastr.success('Email Sent! Check your inbox.', 'Forogt Password');
        this.helper.closeModel();
    },err => {
      this.toastr.error(err.message, 'Error sending Email!');
      this.helper.closeModel();
    });
  }

}
