import { Component, OnInit } from '@angular/core';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { HelperService } from '../../services/helper.service';
import {map, finalize} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.css']
})
export class SubCategoriesComponent implements OnInit {

  showSpinner: boolean = true;
  userFilter={
    name: ''
  };
  image: string = './../../assets/app-assets/images/section.png';
  category;
  cat={
    categoryId: '',
    categoryName: '',
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
  selected;
  categories;
  itemA;
  click: boolean = false;

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
    this.api.getSubCategory()
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
    this.helper.openModelLg(content);
    this.getCat();
  }

  getCat(){
    this.api.getCategory()
    .pipe(map(actions => actions.map(a=>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
    .subscribe(res =>{
      this.categories = res;
      this.selected = this.categories[0].name;
      this.cat.categoryId = this.categories[0].did;
      this.cat.categoryName = this.categories[0].name;
    })
  }

  onChange(event){
    
    this.categories.forEach(a =>{
      if(a.name === event){
        this.cat.categoryId = a.did;
        this.cat.categoryName = a.name;
      }
    })
  }

  createCat(){
    if(this.cat.name != '' && this.cat.lname != '' && this.cat.imageURL != ''){
      this.api.checkIfSubCategoryExists(this.cat.name)
        .subscribe(res =>{
          if(res.length  === 0){
            this.api.createSubCategory(this.cat)
              .then(res => {
                this.helper.closeModel();
                this.toastr.success('Category added successfully!', 'Creating Category');
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
    this.ref = this.fireStorage.ref(`sub_categories/${id}`);
    if( (this.cat.name != '' || this.itemA.name !== '') && (this.cat.lname != '' || this.itemA.lname !== '')){  
      this.task = this.ref.put(event.target.files[0]);
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.image = url;
            this.cat.imageURL = url;
            this.click = false;
            this.itemA.imageURL = url;
           // this.createCat();
          });
        })
      ).subscribe();
    }
    else 
      this.toastr.error('First Fill the fields to upload the image.','Error!');

  }

  
  edit(content, item){
    this.helper.openModelLg(content);
    this.itemA = item;
  }

  updateSubCategory(){
    if(this.click === true){
      this.toastr.warning('Image Uploading');
    }
    else{
      let id = this.itemA.did;
    delete this.itemA['did'];
    let image =  this.itemA.imageURL;
    this.api.updateSubCategory(id, this.itemA)
    .then(res =>{
      this.helper.closeModel();
      this.toastr.success('Category Update Successfully.','User Updated');
      this.itemA = {};
    }, err =>{
      this.toastr.error(err.message, 'Error!');
    })
    }
    
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.name}`)){
      this.api.deleteSubCategory(item.did)
        .then(res => {
          this.toastr.success('Data Delted Successfully.','Record Deletion');
          
        }, err => {
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  

}
