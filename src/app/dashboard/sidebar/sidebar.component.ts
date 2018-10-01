import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  type: string = "Menu";
  privilege: boolean = false;

  constructor() { }

  ngOnInit() {
    if(localStorage.getItem('privilegeType') === 'MASTER')
    {
      this.type = 'Master Admin';
      this.privilege = true;
    }
    else if(localStorage.getItem('privilegeType') === 'ADMIN'){
      this.type ="Admin";
      this.privilege = false;
    }
    console.log(localStorage.getItem('privilegeType'))
  }

}
