import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestOptionsArgs, Headers, URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { IResult, IClass, IRoom, ICourse, ICoach } from './models';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AppService {

  baseApiUrl: string = environment.api;
  showForm = new BehaviorSubject(false);
  cityUrlName: string;
  clubNetId: string;
  clubId: string;
  testUrl = new BehaviorSubject( '' );
  theme = new BehaviorSubject( '' );
  room = new BehaviorSubject( '' );
  isVk = new BehaviorSubject(false);

  constructor( private http: Http, private router: ActivatedRoute ) {

    this.router.queryParams.subscribe( res => {
      if ( res.cityUrlName && res.clubNetId && res.clubId ) {
        this.cityUrlName = res.cityUrlName;
        this.clubNetId = res.clubNetId;
        this.clubId = res.clubId;

        if ( res.theme && res.theme !== 'undefined' ) {
          this.theme.next( res.theme );
        }

        if ( res.room && res.room !== 'undefined' ) {
          this.room.next( res.room );
        }

        this.testUrl.next( `${ this.baseApiUrl }cities/${ this.cityUrlName }/nets/${ this.clubNetId }/clubs/${ this.clubId }/` );
      } else if ( res.group_id ){
        this.isVk.next(true);
        this.http.get('https://api.sportpriority.com/v1/vk-widget-context?gid='+res.group_id)
          .toPromise()
          .then( response => {
            if( response.status !== 200 ){
              this.showForm.next(true);
              return;
            }
            let ctx = response.json();
            this.cityUrlName = ctx['cityUrlName'];
            this.clubNetId = ctx['clubNetId'];
            this.clubId = ctx['clubId'];
            this.testUrl.next( `${ this.baseApiUrl }cities/${ this.cityUrlName }/nets/${ this.clubNetId }/clubs/${ this.clubId }/` );
          })
      } else {
        if( res.viewer_id ) this.isVk.next(true);
        if (!location.search || ( res.viewer_id && !res.group_id ) ) this.showForm.next(true);
      }
    } );
  }

  public url () {
    return this.testUrl.asObservable();
  }

  public getTheme () {
    return this.theme.asObservable();
  }

  public getRoom () {
    return this.room.asObservable();
  }

  getItems ( date?: any ): Promise<IResult> {
    const url = this.testUrl.value + 'schedule';
    const params: URLSearchParams = new URLSearchParams();
    params.set( 'withStatus', 'published' );

    if ( date ) {
      params.set( 'baseDate', `${ date }` );
    }

    return this.http.get( url, { params: params } )
      .toPromise()
      .then( res => res.json() );
  }

  getItem ( item: any ) {
    let url;
    if ( item.id === '00000000000000000000000000000000' ) {
      url = this.testUrl.value + 'classes/virtual/' + item.prototypeId + '?date=' + item.startDate;
    } else {
      url = this.testUrl.value + 'classes/' + item.id;
    }
    return this.http.get( url )
      .toPromise()
      .then( res => res.json() );
  }

}
