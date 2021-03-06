import { Component, OnInit } from '@angular/core';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { HelperService } from '../../services/helper.service';
import {map, finalize} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  showSpinner: boolean = true;
  userFilter={
    name: ''
  };
  image: string = './../../assets/app-assets/images/section.png';
  category;
  cat={
    name: '',
    lname: '',
    imageURL: ''
  };
  p: number = 1;
  catImage: string = './../../assets/app-assets/images/blank.png';
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  createC: boolean = false;
  click: boolean = false;
  changeCat;

  constructor(
    private api: ApiService,
    private helper: HelperService,
    private toastr: ToastrService,
    private fireStorage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getCategory()
      .pipe(map(actions => actions.map(a=>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.category = res;
        this.showSpinner = false;
      })
  }

  add(content){
    this.changeCat = true;
    this.helper.openModelLg(content);
  }

  createCat(){
    if(this.cat.name != '' && this.cat.lname != '' && this.cat.imageURL != ''){
      this.api.checkIfCategoryExists(this.cat.name)
        .subscribe(res =>{
          if(res.length  === 0){
            this.api.createCategory(this.cat)
              .then(res => {
                this.createC = false;
                this.helper.closeModel();
                this.toastr.success('Category added successfullt!', 'Creating Category');
                this.cat.name = '';
                this.cat.lname = '';
                this.cat.imageURL = '';
              }, err => {
                this.toastr.error(err.message,'Error!');
              })
          }
        })
      
    }

    else{
      this.toastr.warning('Please Fill all the fields.','Warning!');
    }

  }

  upload(event){
    this.click = true;
    let id = Math.floor(Date.now() / 1000);
    this.ref = this.fireStorage.ref(`categories/${id}`);
    if((this.cat.name != '' || this.changeCat.name !== '') && (this.cat.lname != '' || this.changeCat.lname !== '')){  
      this.task = this.ref.put(event.target.files[0]);
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.image = url;
            this.cat.imageURL = url;
            this.changeCat.imageURL = url;
            this.click = false;
            //if(this.createC === true)
              //this.createCat();
          });
        })
      ).subscribe();
    }
    else 
      this.toastr.error('First Fill the fields to upload the image.','Error!');

  }

  edit(content, item){
    this.helper.openModelLg(content);
    this.changeCat = item;
    this.createC=false;
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.name}`)){
      this.api.deleteCategory(item.did)
        .then(res => {
          this.toastr.success('Data Delted Successfully.','Record Deletion');
        }, err => {
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  updateCategory(){
    if(this.click === true)
    {
      this.toastr.warning('Image Uploading.');
    }
    else{
        let id = this.changeCat.did;
    delete this.changeCat['did'];
    let url = this.changeCat.imageURL;
    this.changeCat.imageURL = (this.cat.imageURL !== '') ? this.cat.imageURL : url;
    this.api.updateCategory(id, this.changeCat)
    .then(res =>{
      this.helper.closeModel();
      this.toastr.success('Category Update Successfully.','User Updated');
      this.changeCat = {};
    }, err =>{
      this.toastr.error(err.message, 'Error!');
    })
    }
  
  }

  

}
