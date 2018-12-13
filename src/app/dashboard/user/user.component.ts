import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../services/helper.service';
import { AuthService } from 'src/app/services/auth.service';

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
  selectedStatus;

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private helper: HelperService,
    private auth: AuthService
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

  res

  delete(item){
    if(confirm(`Do you want to delete: ${item.email}`))
    {
      let id = item.did;
      this.api.deleteAdminData(id)
        .then( res=>{
          this.helper.deleteUser(id)
            .subscribe(res =>{
              this.res = res;
              if(this.res._body === 'ok' || this.res.status === 200){
                  this.toastr.success('Data Deleted Successfully.','Deletion!');
              }
              else{
                this.toastr.error('User Not deleted.', 'Error!');
              }
            });
        }, err=>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  deleteCustomer(item){
    if(confirm(`Do you want to delete: ${item.email}`)){
      let id = item.did;
      let pid = item.phoneId;
      this.api.deleteCustomer(id)
        .then(res => {
          this.removeWorker(id);
          this.helper.deleteUser(id)
            .subscribe(res =>{
              this.res = res;
              if(this.res._body === 'ok' || this.res.status === 200){
                  this.toastr.success('Data Deleted Successfully.','Deletion!');
                  if(pid){
                    this.removePhoneId(pid);
                  }
              }
              else{
                this.toastr.error('User Not deleted.', 'Error!');
              }
            });
        }, err =>{
          this.toastr.error(err.message, 'Error');
        })
    }
  }

  removePhoneId(id){
    this.helper.deleteUser(id)
      .subscribe(res =>{
        if(res.status !== 200)
        this.toastr.error('Something Went Wrong.', 'Error');
    });
  }

  removeCustomer(id){
    this.api.deleteCustomer(id);
    this.api.deleteUser(id);
  }
  removeWorker(id){
    this.api.deleteWorker(id);
    this.api.deleteUser(id);
  }

  deleteWorker(item){
    if(confirm(`Do you want to delete: ${item.email}`)){
      let id = item.did;
      let pid = item.phoneId;
      this.api.deleteWorker(item.did)
        .then(res => {
          this.removeCustomer(id);
          this.helper.deleteUser(id)
            .subscribe(res =>{
              this.res = res;
              if(this.res._body === 'ok' || this.res.status === 200){
                  this.toastr.success('Data Deleted Successfully.','Deletion!');
                  if(pid){
                    this.removePhoneId(pid);
                  }
              }
              else{
                this.toastr.error('User Not deleted.', 'Error!');
              }
            });
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

  editCustomer(content, item){
    this.helper.openModelLg(content);
    this.itemC = item;
  }

  updateCustomer(){
    let id = this.itemC.did;
    delete this.itemC['did'];

    this.api.updateCustomer(id, this.itemC)
    .then(res =>{
      this.helper.closeModel();
      this.toastr.success('User Update Successfully.','User Updated');
    }, err =>{
      this.toastr.error(err.message, 'Error!');
    })
  }

  editWorker(content, item){
    this.helper.openModelLg(content);
    this.itemW = item;
    if(this.itemW.status === true)
      this.selectedStatus = 'active'
    else if(this.itemW.status === false)
      this.selectedStatus = 'offline'
  }

  updateWorker(){
    let id = this.itemW.did;
    delete this.itemW['did'];

    this.api.updateWorker(id, this.itemW)
    .then(res =>{
      this.helper.closeModel();
      this.toastr.success('User Update Successfully.','User Updated');
    }, err =>{
      this.toastr.error(err.message, 'Error!');
    })
  }

  statusChanged(event){
    if(event === 'offline'){
      this.itemW.status = false;
    }
    else if(event === 'active'){
      this.itemW.status = true;
    }
  }





}
