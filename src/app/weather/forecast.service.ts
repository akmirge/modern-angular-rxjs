import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  pluck,
  filter,
  toArray,
  share,
  tap,
  catchError,
  retry
} from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string,
    main: {
      temp: number;
    }
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';
  constructor(private http: HttpClient,
    private notificationsService: NotificationsService) { }

  getForecast() {
    return this.getCurrentLocation()
      .pipe(
        map(coords => {
          return new HttpParams()
            .set('lat', (coords.latitude).toString())
            .set('lon', (coords.longitude).toString())
            .set('units', 'metric') //For celsius
            // .set('units', 'imperial') --> This is for fahrenheit
            .set('appid', 'c42f06e53746657493f767769e2490b5');
        }),
        switchMap(params => this.http.get<OpenWeatherResponse>(this.url, { params: params })
        ),
        pluck('list'),
        mergeMap((value) => of(...value)),
        filter((value, index) => index % 8 === 0),
        map((value) => {
          return {
            dateString: value.dt_txt,
            temp: value.main.temp
          };
        }),
        toArray(),
        share()
      ).pipe(
        retry(1),
        tap(
          () => {
          this.notificationsService.addSuccess('Got the 5 day forecast!')
          }
        ),
        catchError((err) => {
          this.notificationsService.addError('Failed to get the 5 day forecast!'); // Handle the error
          return throwError(err); // Return a new Observable
        })
      );

  }

  getCurrentLocation() {
    return new Observable<Coordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (err) => observer.error(err)
      );
    }).pipe(
      retry(2), // This is going to resubscribe two more times
      tap(
        () => {
          this.notificationsService.addSuccess('Got your location!');
        }
      ),
      catchError((err) => {
        // #1 - Handle the error
        this.notificationsService.addError('Failed to get your location!');
        // #2 - Return a new Observable
        return throwError(err) // Or below
        // return new Observable((observer) => {
        //    observer.error(err);
        // });
      })
    );
  }
}
