import { Component, OnInit } from '@angular/core';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  image: string='./../../../assets/app-assets/images/user.png';
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  user;
  showSpinner: boolean = true;

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private fireStorage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.getUserInformation(localStorage.getItem('aid'));
  }

  
  upload(event){
    const id =  localStorage.getItem('aid');
    this.ref = this.fireStorage.ref(`users ${id}`);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.image = url;
          this.user.image = url;
          this.update();
        });
      })
    ).subscribe();

  }

  update(){
    const id = localStorage.getItem('aid');
    if(localStorage.getItem('privilegeType') === 'MASTER'){
      this.api.updateMasterAdminProfile(id, this.user)
      .then(res =>{
        this.toastr.success("Profile Update Successfully!", "Edit Profile");
        this.router.navigate(['/dashboard/home']);
      }, err =>{
        this.toastr.error("Information not updated!","Error!");
        console.log(err);
      })
    }
    else{
    this.api.updateAdminData(id, this.user)
      .then(res =>{
        this.toastr.success("Profile Update Successfully!", "Edit Profile");
        this.router.navigate(['/dashboard/home']);
      }, err =>{
        this.toastr.error("Information not updated!","Error!");
        console.log(err);
      })
    }
  }

  getUserInformation(id){
    if(localStorage.getItem('privilegeType') === 'MASTER'){
      this.api.getMasterAdminProfile(id).pipe(map(actions =>  {
        const user = actions.payload.data();
        const id = actions.payload.id;
        return {id, ...user};
  
      }))
        .subscribe(res =>{
          this.user = res;
          this.showSpinner = false;
        });  
    }
    else {
    this.api.getAdminData(id).pipe(map(actions =>  {
      const user = actions.payload.data();
      const id = actions.payload.id;
      return {id, ...user};

    }))
      .subscribe(res =>{
        this.user = res;
        this.showSpinner = false;
      });    
    }  
  }

}
