import {Component, OnInit, ViewChild, ElementRef, HostListener, ViewEncapsulation} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IResult, IClass, IRoom, ICourse, ICoach } from './models';
import { AppService } from './app.service';
import { FormControl } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { environment } from '../environments/environment';

@Component( {
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  animations: [
    trigger( 'fadeIn', [
      state( 'in', style( { transform: 'translateY(0)', opacity: 1 } ) ),
      transition( 'void => *', [
        style( { transform: 'translateY(30px)', opacity: 0 } ),
        animate( '0.2s ease-out' )
      ] )
    ] ),
    trigger( 'fade', [
      state( 'in', style( { opacity: 1 } ) ),
      transition( 'void => *', [
        style( { opacity: 0 } ),
        animate( '0.2s ease-out' )
      ] )
    ] )
  ]
} )
export class AppComponent implements OnInit {

  @ViewChild( 'container' ) elementView: ElementRef;
  public res: IResult;
  public classes: IClass[];
  public nightClasses: IClass[];
  public courses: string[];
  public coaches: string[];
  public rooms: string[];
  public baseDate: Date;
  public checkedCourses: string[];
  public checkedCoaches: string[];
  public checkedRooms: string[];
  public days: string[];
  public timetable: any = {
    hours: []
  };
  public currentDay: string;
  public theme = '';
  public room = '';
  public isLoading: boolean;
  public isMobile: boolean;
  public source: any;
  public originUrl: string;
  public classInfo: any;
  public isVk;
  public showForm;
  public clubs;

  constructor( public service: AppService ) { }

  @HostListener( 'window:message', [ '$event' ] )
  listener ( $event: any ) {
    if ( $event.data === 'schedule' ) {
      this.source = $event.source;
      this.originUrl = $event.origin;
    }
  }

  @HostListener( 'window:resize' )
  onResize () {
    this.isMobile = !window.matchMedia( 'only screen and (min-width: 768px)' ).matches;
  }

  ngOnInit () {
    this.days = [
      'понедельник',
      'вторник',
      'среда',
      'четверг',
      'пятница',
      'суббота',
      'воскресенье'
    ];

    this.service.showForm.subscribe( value => this.showForm = value );

    this.service.isVk.subscribe( status => this.isVk = status );

    this.isMobile = !window.matchMedia( 'only screen and (min-width: 768px)' ).matches;

    this.service.url().subscribe( res => {
      if ( res ) {
        this.getItems();
      }
    } );

    this.service.getTheme().subscribe( res => {
      this.theme = res;
    } );

    this.service.getRoom().subscribe( res => {
      if ( res ) {
        this.room = res;
        this.checkedRooms = [ this.room ];
      }
    } );
  }

  handleCourses ( e: string[] ): void {
    this.checkedCourses = e;
    this.updateHeight();
  }

  handleCoaches ( e: string[] ): void {
    this.checkedCoaches = e;
    this.updateHeight();
  }

  handleRooms ( e: string[] ): void {
    this.checkedRooms = e;
    this.updateHeight();
  }

  updateHeight () {
    setTimeout( () => {
      if ( this.elementView && this.source ) {
        this.source.postMessage( {
          origin: 'schedule',
          height: this.elementView.nativeElement.offsetHeight
        }, this.originUrl );
      }
    } );
  }

  changeCurrentDay ( d: number ): void {
    this.currentDay = new Date( this.baseDate.getTime() + ( 86400000 * d ) ).toLocaleDateString( 'ru' );
    this.updateHeight();
  }

  getItems ( date?: any ) {
    this.isLoading = true;
    this.service.getItems( date )
      .then( res => {
        console.log(res);
        this.res = res;
        this.nightClasses = res.classes.filter( itemClass => parseInt( itemClass.startTime.split(':')[0] ) < 7);
        console.log(this.nightClasses);
        this.classes = res.classes.filter( itemClass => itemClass.classStatus === 'available');
        this.baseDate = this.str2date( res.startDate );

        this.currentDay = ( new Date() > this.baseDate && new Date() < this.str2date( res.endDate ) ) ?
          new Date().toLocaleDateString( 'ru' ) :    // если текущая неделя, то currentDay = сегодня
          this.baseDate.toLocaleDateString( 'ru' );  // если нет, то сurrentDay - понедельник выбранной недели

        this.rooms = this.getUniqueItems( res.classes, 'room', 'name' );    // Залы

        if ( this.room ) {
          this.classes = this.classes
            .filter( item => item.room )
            .filter( item => item.room.name === this.room );
        }

        this.courses = this.getUniqueItems( this.classes, 'course', 'name' );  // Курсы
        this.coaches = this.getUniqueItems( this.classes, 'coach', 'name' );   // Тренеры

        this.timetable.hours = [];

        for ( const hour of this.createRange( 0, 23 ) ) {
          this.timetable.hours.push( {
            hour: this.format2digits( hour ),
            days: [],
            isEmptyHour: true
          } );

          for ( const day of this.createRange( 0, 6 ) ) {
            const cdate = this.addDays( new Date( this.baseDate ), day );

            this.timetable.hours[ hour ].days.push(
              {
                day: cdate,
                dateString: cdate.toLocaleDateString( 'ru' ),
                items: []
              }
            );
          }
        }

        for ( const item of this.classes ) {
          const h = parseInt( item.startTime.substr( 0, 2 ), 10 );
          // Номер часа в таблице
          const d = new Date( this.str2date( item.startDate ).getTime() - this.baseDate.getTime() ).getUTCDate() - 1;
          // console.log('d', d);
          // Номер дня в таблице
          if ( d < 7 && d >= 0 ) {
            this.timetable.hours[ h ].days[ d ].items.push( item );
            this.timetable.hours[ h ].isEmptyHour = false;
          }
        }

        this.isLoading = false;

        this.updateHeight();
      } );
  }

  changeDate ( date: any, factor = 1 ): void {
    const [ day, month, year ] = date.split( '.' );
    const timestamp = new Date( year, month - 1, day ).getTime() + ( 86400000 * factor );
    const newDate = new Date( timestamp ).toLocaleDateString( 'ru' );
    this.getItems( newDate );
  }

  public async openModal ( item: IClass, day: number ) {
    try {
      this.isLoading = true;
      const res = await this.service.getItem( item );
      this.classInfo = res;
      this.classInfo.day = this.days[ day ];
    }
    finally {
      if ( this.source ) {
        this.source.postMessage( {
          origin: 'schedule',
          scrollOrigin: true
        }, this.originUrl );
      }
      this.isLoading = false;
    }
  }

  closeModal ( e: any, a?: boolean ): void {
    if ( e.target.id === 'modal-info' || a ) {
      this.classInfo = null;
    }
  }

  createRange ( start: any, end: any ) {
    const items = [];
    for ( let i = start; i <= end; i++ ) {
      items.push( i );
    }
    return items;
  }

  addDays ( date: Date, days: number ): Date {
    const newDate = new Date( date );
    newDate.setTime( date.getTime() + days * 86400000 );
    return newDate;
  }

  str2date ( s: any ) {
    return new Date(
      parseInt( s.substr( 6, 4 ), 10 ), // year
      parseInt( s.substr( 3, 2 ), 10 ) - 1, // month
      parseInt( s.substr( 0, 2 ), 10 ), // day
      1,
      1
    );
  }

  format2digits ( number: any ) {
    return ( '0' + number ).slice( -2 );
  }

  getUniqueItems ( classes: any, item: any, arg: any ) {
    return classes
      .filter( ( i: any ) => i[ item ] && i[ item ][ arg ] )
      .map( ( i: any ) => i[ item ][ arg ] )
      .reduce( ( uniqueNames: any, itm: any ) => {
        if ( uniqueNames.indexOf( itm ) === -1 ) {
          uniqueNames.push( itm );
        }
        return uniqueNames;
      }, [] );
  }

  checkDayForClass(item, index){
    const d = new Date( this.str2date( item.startDate ).getTime() - this.baseDate.getTime() ).getUTCDate() - 1;
    return d === index;
  }

}
