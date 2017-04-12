import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2MobxModule } from 'ng2-mobx';

import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { BuyGroupComponent } from './components/buy-group/buy-group.component';
import { BuyListComponent } from './components/buy-list/buy-list.component';
import { BuyPreviewListComponent } from './components/buy-preview-list/buy-preview-list.component';
import { BuyListDataStore } from './stores/buy-list-data.store';

const appRoutes =
  [
    {
      path: '',
      redirectTo: '/mobxbuygroup',
      pathMatch: 'full'
    },
    {
      path: 'mobxbuygroup',
      component: BuyGroupComponent
    },
    {
      path: 'about',
      component: AboutComponent
    },
    {
      path: 'buylistdetails/:id',
      component: BuyListComponent
    }
  ];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    BuyGroupComponent,
    BuyListComponent,
    BuyPreviewListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    Ng2MobxModule
  ],
  providers: [BuyListDataStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
