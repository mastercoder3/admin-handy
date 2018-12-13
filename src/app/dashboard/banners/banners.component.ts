import { Component, OnInit } from '@angular/core';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { ApiService } from '../../services/api.service';
import {map, finalize} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperService } from '../../services/helper.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {

  showSpinner: boolean = true;
  userFilter={
    name: ''
  };
  p: number = 1;
  image: string = './../../assets/app-assets/images/blank.png';
  offers;
  newOffer={
    name: '',
    text: '',
    imageURL: ''
  };
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  pAdmin: number = 1;
  
  constructor(
    private api: ApiService,
    private helper: HelperService,
    private fireStorage: AngularFireStorage,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getOffers()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

      .subscribe(res =>{
        this.offers = res;
        this.showSpinner = false;
      })
  }

  add(addOffer){
    this.helper.openModelLg(addOffer);
  }

  upload(event){
    const id = Math.random().toString(36).substring(2);
    this.ref = this.fireStorage.ref(`offers/${id}`);
    if(this.newOffer.name != '' && this.newOffer.text != ''){  
      this.task = this.ref.put(event.target.files[0]);
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.image = url;
            this.newOffer.imageURL = url;
          });
        })
      ).subscribe();
    }
    else 
      this.toastr.error('First Fill the fields to upload the image.','Error!');

  }

  createOffer(){
    if(this.newOffer.name != '' && this.newOffer.text != '' && this.newOffer.imageURL !=''){
      this.api.createOffer(this.newOffer)
        .then(res =>{
          this.newOffer.name = this.newOffer.text = this.newOffer.imageURL = '';
          this.toastr.success('Offer Added Successfully!','Operation Successfull');
          this.helper.closeModel();
        })
    }
    else{
      this.toastr.warning('Please Fille the fields to continue.','Warning!');
    }
  }

  delete(item){
    if(confirm(`Are you sure you want to delete ${item.name}`)){
      this.api.deleteOffer(item.did)
        .then(res => {
          this.toastr.success('Offer Deleted successfully!','Operation completed');
        }, err => {
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

}
