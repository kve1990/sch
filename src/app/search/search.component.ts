import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormControl } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { SearchService } from './search.service';
import { AppService } from '../app.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchService]
})
export class SearchComponent implements OnInit {

  @ViewChild ('searchingClub') searchingClub: ElementRef;
  public searchedClubs;
  public selectedClub;
  public searchTerm = new FormControl();
  private searchSubscription: Subscription = null;

  constructor(private service: SearchService, private appService: AppService) { }

  ngOnInit() {
  	this.searchTerm.valueChanges
  	      .debounceTime( 400 )
  	      .distinctUntilChanged()
  	      .subscribe(( query: string ) => {
  	        this.searchClubsByText( query );
  	      } );
  }

  searchClubsByText ( input ) {
    const pattern = input.trim();

    if ( pattern.length < 2 ) {
      return;
    } else {
      if ( this.searchSubscription ) {
        this.searchSubscription.unsubscribe();
        this.searchSubscription = null;
      }
      this.searchSubscription = Observable
        .fromPromise( this.service.searchClubs( pattern ) )
        .subscribe( res => {
          console.log(res);
          this.searchedClubs = res.clubs;
        } );
    }
  }

  searchClubs ( input ) {
    this.selectedClub = input;
    this.searchingClub.nativeElement.value = input.name;

    
    // const searchInput = input;

    // this.service.searchClubs( searchInput )
    //   .then( res => {
    //     console.log(res);
    //     this.clubs = res.clubs;
    //   } );
  }

  choseClub (club) {
    this.appService.testUrl.next( `${ environment.api }cities/moscow/nets/${ club.clubNetId }/clubs/${ club.id }/` );
    this.appService.showForm.next(false);
  }

}
