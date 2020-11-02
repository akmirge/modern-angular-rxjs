import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NewsApiService, Article } from '../news-api.service';
@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.css']
})
export class NaArticleListComponent implements OnInit {
  articles: Article[];
  numberOfPages: number;
  constructor(private newsApiService: NewsApiService) {
    this.newsApiService.pagesOutput.subscribe((articles) => {
      this.articles = articles;
    });
    this.newsApiService.getPage(1); // default is one page
    this.getNumberOfPages();
  }

  ngOnInit(): void {
  }

  getNumberOfPages() {
    this.newsApiService.numberOfPages.subscribe((numOfPages) => {
      this.numberOfPages = numOfPages;
    });
  }

  getNewPage(page: number) {
    this.newsApiService.getPage(page);
  }

}
