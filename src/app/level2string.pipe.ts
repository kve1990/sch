import { Pipe, PipeTransform } from '@angular/core';

const levels = {
    any: 'любой',
    beginner: 'начинающий',
    advanced: 'продвинутый'
};

@Pipe( {
    name: 'level2string',
} )
export class Level2StringPipe implements PipeTransform {
    transform ( value: string ) {
        return levels[ value ] || null;
    }
}
