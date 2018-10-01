import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  selected: string;
  showSpinner: boolean = true;
  admins;
  customers;
  workers;
  userFilter={
    email: ''
  };
  showAdmin: boolean = true;
  showCustomers: boolean = false;
  showWorker: boolean = false;
  pAdmin: number = 1;
  p: number = 1;
  pWorker: number = 1;
  itemA;
  itemC;
  itemW;

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private helper: HelperService
  ) { }

  ngOnInit() {
    this.selected = 'Admins';


    this.getData();
  }

  getData(){
    this.showSpinner = true;
    this.api.getAdmins()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res => {
          this.admins = res;
          this.showSpinner = false;
        })
  }

  delete(item){
    if(confirm(`Do you want to delete: ${item.email}`))
    {
      let id = item.did;
      this.api.deleteAdminData(id)
        .then( res=>{
          this.toastr.success('Data Deleted Successfully.','Deletion!');
        }, err=>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  deleteCustomer(item){
    if(confirm(`Do you want to delete: ${item.email}`)){
      let id = item.did;
      this.api.deleteCustomer(id)
        .then(res => {
          this.toastr.success('User Data Deleted Successfully.','Deletion!')
        }, err =>{
          this.toastr.error(err.message, 'Error');
        })
    }
  }

  deleteWorker(item){
    if(confirm(`Do you want to delete: ${item.email}`)){
      this.api.deleteWorker(item.did)
        .then(res => {
          this.toastr.success('User Data deleted Successfully.','Deletion');
        }, err =>{
          this.toastr.error(err.message, 'Error');
        });
    }
  }

  viewChange(){
    if(this.selected == 'Admins'){
      this.getData();
      this.showAdmin = true;
      this.showCustomers = false;
      this.showWorker = false;
    }
    else if(this.selected == 'Customers'){
      this.getCustomers();
      this.showAdmin = false;
      this.showCustomers = true;
      this.showWorker = false;
    }
    else if(this.selected == 'Workers'){
      this.getWorkers();
      this.showAdmin = false;
      this.showCustomers = false;
      this.showWorker = true;
    }
  }

  getCustomers(){
    this.showSpinner = true;
    this.api.getCustomers()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.customers = res;
          this.showSpinner = false;
        });
  }

  getWorkers(){
    this.showSpinner = true;
    this.api.getWorker()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res => {
          this.workers = res;
          this.showSpinner = false;
        });
  }

  edit(content, item){
    this.helper.openModelLg(content);
    this.itemA = item;
  }

  updateAdmin(){
    let id = this.itemA.did;
    delete this.itemA['did'];
    
    this.api.updateAdminData(id, this.itemA)
      .then(res =>{
        this.helper.closeModel();
        this.toastr.success('User Update Successfully.','User Updated');
      }, err =>{
        this.toastr.error(err.message, 'Error!');
      })
  }



}
