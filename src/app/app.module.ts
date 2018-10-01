import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ToastrModule } from 'ngx-toastr';
import {NgbPaginationModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './entry/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import {SidebarComponent} from './dashboard/sidebar/sidebar.component';
import {AddUserComponent} from './dashboard/add-user/add-user.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { UserComponent } from './dashboard/user/user.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    AddUserComponent,
    EditProfileComponent,
    SpinnerComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    FilterPipeModule,
    NgbPaginationModule,
    NgbModule,
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'dashboard', component: DashboardComponent, children: [
        {path: '', redirectTo: 'home', pathMatch: 'full'},
        {path: 'home', component: HomeComponent},
        {path: 'edit-profile', component: EditProfileComponent},
        {path: 'add-user', component: AddUserComponent},
        {path: 'users', component: UserComponent}
      ]}
    ])

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
