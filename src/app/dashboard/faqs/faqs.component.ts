import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {

  showSpinner: boolean = true;
  p: number = 1;
  faqs;
  title;
  detail;

  constructor(private api: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.api.getFaqs()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      })))
      .subscribe(res =>{
        this.faqs = res;
        this.showSpinner = false;
      })
  }

  delete(item){
    if(confirm(`Do you want to delete ${item.title}`)){
      let id = item.id;
      delete item['id'];
      this.api.deleteFaq(id)
      .then(res =>{
        this.toastr.success('Record has been deleted','Operation Completed')
      },err =>{ 
        this.toastr.error(err.message);
      });
    }
  }

  add(){
    if(this.title !== '' && this.detail !== ''){
      this.api.addFaq({title: this.title, faq: this.detail})
        .then(res =>{
          this.toastr.success('Faq added successfully.','Operation Successfull');
          this.title = '';
          this.detail = '';
        },err =>{
          this.toastr.error(err.message);
        })
    }
  }

}
