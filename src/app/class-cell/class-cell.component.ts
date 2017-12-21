import { Component, OnInit, Input } from '@angular/core';
import { trigger, state,  style, animate, transition } from '@angular/animations';

@Component({
  selector: 'class-cell',
  templateUrl: './class-cell.component.html',
  styleUrls: ['./class-cell.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('in', style({opacity: 1})),
      transition('void => *', [
        style({ opacity: 0}),
        animate('0.2s ease-out')
      ])
    ])
  ]
})
export class ClassCellComponent implements OnInit {

  state: boolean = false;

  @Input() class:any;

  constructor() { }

  ngOnInit() {
  }

}
