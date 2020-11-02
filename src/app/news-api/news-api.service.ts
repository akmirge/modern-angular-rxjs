import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, map, switchMap, pluck } from 'rxjs/operators';

export interface Article {
  title: string;
  url: string;
  source: {
    name: string;
  }
}

interface NewsApiResponse {
  totalResults: number;
  articles: Article[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10; //Num of articles
  private apiKey = '0393a7b84c4840e1a584cb3100140649';
  private country = 'us';

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;
  numberOfPages: Subject<number>;

  constructor(private http: HttpClient) {
    this.pagesInput = new Subject();
    this.numberOfPages = new Subject();
    this.pagesOutput = this.pagesInput.pipe(
      map((page) => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', this.pageSize.toString())
          .set('page', String(page))
      }),
      switchMap((params) => {
        return this.http.get<NewsApiResponse>(this.url, { params: params })
      }),
      tap((response: NewsApiResponse) => {
        // 55/10 = Math.ceil(5.5) -> 6 pages
        const totalPages = Math.ceil((response.totalResults) / this.pageSize);
        this.numberOfPages.next(totalPages);
      }),
      pluck('articles')
    )
  }

  getPage(page: number) {
    this.pagesInput.next(page);
  }

}
