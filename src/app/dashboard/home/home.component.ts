import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts;
  workers;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getWorker()
    .pipe(map(actions=> actions.map(a => {
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))

    .subscribe(res => {
      this.workers = res.length;
    });

    this.api.getPosts()
    .pipe(map(actions=> actions.map(a => {
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))

    .subscribe(res => {
      this.posts = res.length;
    })
  }

}
