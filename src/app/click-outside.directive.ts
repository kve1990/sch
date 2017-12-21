import { Directive, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import { EventsService } from './events.service';

@Directive( {
  selector: '[appClickOutside]'
} )

export class ClickOutsideDirective implements OnInit {

  @Output( 'clickOutside' ) clickOutside: EventEmitter<Object>;

  constructor(
    private _elRef: ElementRef,
    private eventsService: EventsService
  ) {
    this.clickOutside = new EventEmitter();
  }

  ngOnInit () {
    this.eventsService.clickObserver
      .subscribe(( event: MouseEvent ) => {
        this.onGlobalClick( event );
      } );
  }

  onGlobalClick ( event: MouseEvent ) {
    if ( event instanceof MouseEvent ) {
      if ( this.isDescendant( this._elRef.nativeElement, event.target ) === true ) {
        this.clickOutside.emit( {
          target: ( event.target || null ),
          isInside: true
        } );
      } else {
        this.clickOutside.emit( {
          target: ( event.target || null ),
          isInside: false
        } );
      }
    }
  }

  isDescendant ( parent:any, child:any ) {
    let node = child;
    while ( node !== null ) {
      if ( node === parent ) {
        return true;
      } else {
        node = node.parentNode;
      }
    }
    return false;
  }
}
