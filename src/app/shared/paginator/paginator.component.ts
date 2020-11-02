import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  @Input() numberOfPages: number;
  @Output() pageNumber: EventEmitter<number> = new EventEmitter<number>();
  pageOptions: number[];

  currentPage: number = 1;

  constructor() {
  }

  ngOnInit(): void {
    this.setPageOptions();
  }

  getNewPage(page: number) {
    this.pageNumber.emit(page);
    this.currentPage = page;
    this.setPageOptions();
  }

  setPageOptions() {
    this.pageOptions = [
      this.currentPage - 2,
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      this.currentPage + 2
    ].filter(pageNumber => pageNumber >= 1
      && pageNumber <= this.numberOfPages);
  }
}
