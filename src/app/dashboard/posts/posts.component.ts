import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  showSpinner: boolean = true;
  userFilter = {
    status: ''
  };
  p: number = 1;
  posts;
  viewItem;
  image: string = './../../assets/app-assets/images/blank.png';
  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private helper: HelperService
  ) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
    this.api.getPosts()
      .pipe(map(actions=> actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

      .subscribe(res => {
        this.posts = res;
        this.showSpinner = false;
      })
  }

  accept(item){
    let id = item.did;
    delete item['did'];
    item.status = 'active';
    this.api.updatePost(id,item)
      .then(res => {
        this.toastr.success('Post Accepted!','Operation Successfull');
        this.api.createNotification({image: item.customerImage, title: `${item.customerName} just posted a job for ${item.category}.`, time: new Date(), categoryId: item.categoryId, type: 'job', id: id})
          .then(ok => {

          });
      }, err =>{
        this.toastr.error(err.message, 'Error!');
      })
  }

  delete(item){
    let id = item.did;

    if(confirm(`Are you sure you want to Delete ${item.postName}`))
    {
      this.api.deletePost(id)
      .then(res => {
        this.toastr.success('Post deleted Succssfully!','Operation Completed');

      },err => {
        this.toastr.error(err.message,'Error');
      })
    }

  }

  edit(content, item){
    this.helper.openModelLg(content);
    this.viewItem = item;
    this.viewItem.waqt = this.viewItem.date+' '+this.viewItem.time;
  }



}
