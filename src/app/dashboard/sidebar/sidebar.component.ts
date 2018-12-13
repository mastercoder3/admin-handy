import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  type: string = "Menu";
  privilege: boolean = false;

  constructor(private router: Router) { }

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
  }

  logout(){
    localStorage.removeItem('aid');
    localStorage.removeItem('privilegeType');
    this.router.navigate(['/login']);
  }

}
