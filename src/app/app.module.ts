import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ToastrModule } from 'ngx-toastr';
import {NgbPaginationModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import {HttpModule} from '@angular/http';

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
import { CategoriesComponent } from './dashboard/categories/categories.component';
import { SubCategoriesComponent } from './dashboard/sub-categories/sub-categories.component';
import { BannersComponent } from './dashboard/banners/banners.component';
import { PostsComponent } from './dashboard/posts/posts.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { FaqsComponent } from './dashboard/faqs/faqs.component';
import { AuthGaurdService } from './services/auth-gaurd.service';


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
    UserComponent,
    CategoriesComponent,
    SubCategoriesComponent,
    BannersComponent,
    PostsComponent,
    SettingsComponent,
    FaqsComponent
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
    HttpModule,
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
        {path: 'users', component: UserComponent},
        {path: 'categories', component: CategoriesComponent},
        {path: 'sub-categories', component: SubCategoriesComponent},
        {path: 'offers', component: BannersComponent},
        {path: 'posts', component: PostsComponent},
        {path: 'settings', component: SettingsComponent},
        {path:'faqs', component: FaqsComponent}
      ], canActivate: [AuthGaurdService]}
    ])

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
