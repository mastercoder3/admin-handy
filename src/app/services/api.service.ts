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

  checkIfCategoryExists(name){
    return this.afs.collection('category', ref => ref.where('name','==',name)).valueChanges();
  }

  createCategory(data){
    return this.afs.collection('category').add(data);
  }

  //:::::::::::::::::::::::::::::::: Sub-Category CRUD :::::::::::::::::::::::::::::::::::::::::::

  getSubCategory(){
    return this.afs.collection('subCategory').snapshotChanges();
  }

  checkIfSubCategoryExists(name){
    return this.afs.collection('subCategory', ref => ref.where('name','==',name)).valueChanges();
  }

  createSubCategory(data){
    return this.afs.collection('subCategory').add(data);
  }

  // :::::::::::::::::::::::::::::::::::: OFFERS ::::::::::::::::::::::::::::::::::::::::::::::::

  getOffers(){
    return this.afs.collection('offers').snapshotChanges();
  }

  createOffer(data){
    return this.afs.collection('offers').add(data);
  }

  deleteOffer(id){
    return this.afs.doc('offers/'+id).delete();
  }

  // :::::::::::::::::::::::::::::::::::: POSTS ::::::::::::::::::::::::::::::::::::::::::::::::

  getPosts(){
    return this.afs.collection('newposts').snapshotChanges();
  }

  updatePost(id, data){
    return this.afs.doc('newposts/'+id).set(data);
  }

  deletePost(id){
    return this.afs.doc('newposts/'+id).delete();
  }

  updateSubCategory(id,data){
    return this.afs.doc('subCategory/'+id).update(data);
  }

  deleteSubCategory(id){
    return this.afs.doc('subCategory/'+id).delete();
  }

  getSettings(id){
    return this.afs.doc('settings/'+id).valueChanges();
  }

  updateSettings(id,data){
    return this.afs.doc('settings/'+id).update(data);
  }

  getFaqs(){
    return this.afs.collection('faqs').snapshotChanges();
  }

  deleteFaq(id){
    return this.afs.doc('faqs/'+id).delete();
  }

  addFaq(data){
    return this.afs.collection('faqs').add(data);
  }

  createNotification(data){
    return this.afs.collection('notifications').add(data);
  }

  deleteUser(id){
    return this.afs.doc('users/'+id).delete();
  }


}
