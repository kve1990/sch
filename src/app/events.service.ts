import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EventsService {
    public clickObserver: Observable<any>;
    public resizeObserver: Observable<any>;

    constructor() {
        this.clickObserver = Observable
            .fromEvent( document, 'click' );

        this.resizeObserver = Observable
            .fromEvent( window, 'resize' );
    }
}
