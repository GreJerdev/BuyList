import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2MobxModule } from 'ng2-mobx';

import { AppComponent } from './app.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { AboutComponent } from './components/about/about.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ShoppingListData } from './stores/lists-data.store';

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
      path: 'shoppinglist',
      component: ShoppingListComponent
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
    AboutComponent,
    ShoppingListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    Ng2MobxModule
  ],
  providers: [ShoppingListData],
  bootstrap: [AppComponent]
})
export class AppModule { }
