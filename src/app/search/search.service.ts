import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class SearchService {

  baseApiUrl: string = environment.api;

  constructor(private http: Http) { }

  searchClubsByText ( searchText ) {
    return this.http.get(this.baseApiUrl + 'wg/cities/moscow/search/clubs/by-text?searchText=' + searchText + '&pageSize=10')
               .toPromise()
               .then( res => res.json() );
  }

  searchClubs (searchText) {
    return this.http.get(this.baseApiUrl + 'wg/cities/moscow/search/clubs?searchText=' + searchText + '&pageSize=10')
               .toPromise()
               .then( res => res.json() );
  }

}
