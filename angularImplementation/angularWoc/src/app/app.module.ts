//Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router'

//General Imports
import { environment } from '../environments/environment';
import { appRouting } from "./app.routes";

//Components
import { TemplateComponent } from './shared/template/template.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';

//Services
import { AuthService } from './services/auth/auth.service';

//Firebase Modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  declarations: [
    HomeComponent,
    ErrorComponent,
    LoginComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    appRouting,
    AngularFireModule.initializeApp(environment.firebase, 'whats-on-campus'),
		AngularFireDatabaseModule,
		AngularFireAuthModule
  ],
  providers: [AuthService],
  bootstrap: [TemplateComponent]
})

export class AppModule { }





