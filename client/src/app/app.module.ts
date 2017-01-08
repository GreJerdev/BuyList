import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { AboutComponent } from './components/about/about.component';

const appRoutes = 
  [
    {
      path: '',
      redirectTo: '/buylist',
      pathMatch: 'full'
    },
    {
      path: 'buylist',
      component: ItemsListComponent
    },
    {
      path: 'about',
      component: AboutComponent
    }
  ];

@NgModule({
  declarations: [
    AppComponent,
    ItemsListComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
