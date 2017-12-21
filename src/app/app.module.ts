import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AppService } from './app.service';
import { ClassCellComponent } from './class-cell/class-cell.component';
import { FilterSchedulePipe } from './filter-schedule.pipe';
import { DropdownComponent } from './dropdown/dropdown.component';

import { Level2StringPipe } from './level2string.pipe';
import { EventsService } from './events.service';
import { ClickOutsideDirective } from './click-outside.directive';
import { SearchComponent } from './search/search.component';

@NgModule( {
  declarations: [
    AppComponent,
    ClassCellComponent,
    FilterSchedulePipe,
    DropdownComponent,
    ClickOutsideDirective,
    Level2StringPipe,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot( [] )
  ],
  providers: [
    AppService,
    ClickOutsideDirective,
    EventsService
  ],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
