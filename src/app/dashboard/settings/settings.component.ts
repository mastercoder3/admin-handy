import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  charges;
  phone;
  about;
  privacy;

  constructor(private api: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.api.getSettings('subscription')
      .subscribe(res =>{
        this.charges = res;
      });

      this.api.getSettings('phone')
        .subscribe(res =>{
          this.phone =res;
        })
      this.api.getSettings('aboutus')
        .subscribe(res => {
          this.about = res;
        })
        this.api.getSettings('privacy')
        .subscribe(res => {
          this.privacy = res;
        })
  }

  updatePayment(){
    this.api.updateSettings('subscription', this.charges)
    .then(res =>{
      this.toastr.success('Price Updated', 'Subscription Updated');
    }, err => {
      this.toastr.error(err.message);
    })
  }

  updatePhone(){
    this.api.updateSettings('phone', this.phone)
    .then(res =>{
      this.toastr.success('Contact us number Updated', 'Updating complete');
    }, err => {
      this.toastr.error(err.message);
    });
  }

  updateAbout(){
    this.api.updateSettings('aboutus', this.about)
    .then(res =>{
      this.toastr.success('About us text updated', 'Updating complete');
    }, err => {
      this.toastr.error(err.message);
    });
  }

  updatePrivacy(){
    this.api.updateSettings('privacy', this.privacy)
    .then(res =>{
      this.toastr.success('Privacy Policy Updated.', 'Updating complete');
    }, err => {
      this.toastr.error(err.message);
    });
  }

}
