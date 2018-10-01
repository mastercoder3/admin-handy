import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HelperService } from '../../services/helper.service';
import {map} from 'rxjs/operators';

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
  catImage: string = './../../assets/app-assets/images/blank.png';

  constructor(
    private api: ApiService,
    private helper: HelperService
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
    this.helper.openModelLg(content);
  }

}
