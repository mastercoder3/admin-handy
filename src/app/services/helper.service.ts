import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Http, RequestOptions,Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private modalService: NgbModal, private http: Http) { }

  openModel(content){
    this.modalService.open(content, {backdrop: 'static'});
  }

  openModelLg(content){
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  closeModel(){
    this.modalService.dismissAll();
  }

  deleteUser(id){
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: myHeaders });
    //callrequest
    return this.http.post('https://us-central1-handyman-ea0e1.cloudfunctions.net/subscription/delete',{
      uid: id
    }, options);
  }

  
}
