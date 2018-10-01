import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private afs: AngularFirestore) { }


  // :::::::::::::::::::::::::::::::::Master Admin Profile :::::::::::::::::::::::::::::::::::::::

  // Master Admin Get

  getMasterAdminProfile(id){
    return this.afs.doc('root/'+id).snapshotChanges();
  }

  getMasterAdmin(email,password){
    return this.afs.collection('root', ref => ref.where('email','==',email).where('password','==',password)).snapshotChanges();
  }

  updateMasterAdminProfile(id,data){
    return this.afs.doc('root/'+id).set(data);
  }

  // ::::::::::::::::::::::::::::::::::: Admin CRUD ::::::::::::::::::::::::::::::::::::::::::::::::

  getAdminData(id){
    return this.afs.doc('admin/'+id).snapshotChanges();
  }

  //for create and update
  updateAdminData(id,data){
    return this.afs.doc('admin/'+id).set(data);
  }

  deleteAdminData(id){
    return this.afs.doc('admin/'+id).delete();
  }

  getAdmins(){
    return this.afs.collection('admin').snapshotChanges();
  }

  // :::::::::::::::::::::::::::::::: Customers CRUD ::::::::::::::::::::::::::::::::::::::::::::::::::::

  getCustomers(){
    return this.afs.collection('customers').snapshotChanges();
  }

  deleteCustomer(id){
    return this.afs.doc('customers/'+id).delete();
  }

  updateCustomer(id, data){
    return this.afs.doc('customer/'+id).update(data);
  }


  // ::::::::::::::::::::::::::::::::::: Worker CRUD ::::::::::::::::::::::::::::::::::::::::::::::::::::

  getWorker(){
    return this.afs.collection('workers').snapshotChanges();
  }

  deleteWorker(id){
    return this.afs.doc('workers/'+id).delete();
  }

  updateWorker(id,data){
    return this.afs.doc('workers/'+id).update(data);
  }

// ::::::::::::::::::::::::::::::::::: Category CRUD :::::::::::::::::::::::::::::::::::::::::::::::

  getCategory(){
    return this.afs.collection('category').snapshotChanges();
  }

  deleteCategory(id){
    return this.afs.doc('category/'+id).delete();
  }

  updateCategory(id,data){
    return this.afs.doc('category/'+id).update(data);
  }


}
