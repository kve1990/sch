import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'filterSchedule',
  pure: false
} )
export class FilterSchedulePipe implements PipeTransform {

  transform ( value: any, courses?: any, coaches?: any, rooms?: any ): any {
    let result = value;

    if ( courses && courses.length ) {
      result = result.filter( ( i: any ) => {
        if ( i.course && i.course.name ) {
          return courses.indexOf( i.course.name ) >= 0;
        } else {
          return false;
        }
      } );
    }

    if ( coaches && coaches.length ) {
      result = result.filter( ( i: any ) => {
        if ( i.coach && i.coach.name ) {
          return coaches.indexOf( i.coach.name ) >= 0;
        } else {
          return false;
        }
      } );
    }

    if ( rooms && rooms.length ) {
      result = result.filter( ( i: any ) => {
        if ( i.room && i.room.name ) {
          return rooms.indexOf( i.room.name ) >= 0;
        } else {
          return false;
        }
      } );
    }

    return result;
  }

}
