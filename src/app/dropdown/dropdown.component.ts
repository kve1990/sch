import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

function guid ( a: any ): any {
  // tslint:disable-next-line:no-bitwise
  return a ? ( a ^ Math.random() * 16 >> a / 4 ).toString( 16 ) :
    ( 1e7.toString( 16 ) + -1e3 + -4e3 + -8e3 + -1e11 )
      .replace( /[018]/g, guid )
      .replace( /-/g, '' );
}

@Component( {
  selector: 'app-dropdown',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dropdown.component.html',
  styleUrls: [ './dropdown.component.scss' ],
  animations: [
    trigger( 'shrinkOut', [
      state( 'inactive', style( {
        height: '0',
      } ) ),
      state( 'active', style( {
        zIndex: '101'
      } ) ),
      transition( 'inactive => active', animate( '300ms ease-in' ) ),
      transition( 'active => inactive', animate( '300ms ease-out' ) )
    ] )
  ]
} )

export class DropdownComponent implements OnInit {

  @Input() inputNames: string[];
  @Input() alias: string;
  @Output() outputNames: string[];
  @Output() namesUpdated = new EventEmitter();
  public idPrefix = `dropdown_${ guid( null ) }_`;
  public controlState: string;
  public selects: string;

  constructor() { }

  ngOnInit () {
    this.outputNames = [];
    this.controlState = 'inactive';
    this.namesUpdated.emit( this.outputNames );
    this.selects = this.alias;
  }

  onClickOutside ( $e: any ) {
    setTimeout( () => {
      if ( !$e.isInside ) {
        this.controlState = 'inactive';
      }
    } );
  }

  changeState () {
    this.controlState = ( this.controlState === 'inactive' ) ? 'active' : 'inactive';
  }

  check ( e: any ) {
    if ( this.outputNames.indexOf( e ) === -1 ) {
      this.outputNames.push( e );
    } else {
      this.outputNames.splice( this.outputNames.indexOf( e ), 1 );
    }
    this.selects = this.outputNames.join( ', ' ) || this.alias;
    this.namesUpdated.emit( this.outputNames );
  }

  checkAll () {
    if ( this.outputNames.length ) {
      const names = [ ...this.inputNames ];
      this.inputNames = null;
      setTimeout( () => {
        this.outputNames = [];
        this.selects = this.alias;
        this.inputNames = [ ...names ];
        this.namesUpdated.emit( this.outputNames );
      } );
    }
  }
}
