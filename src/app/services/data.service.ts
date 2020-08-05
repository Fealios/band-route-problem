import { Injectable } from '@angular/core';
import { data } from '../../assets/data';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  public getData(count): Observable<any[]> {
    // the data kept in my data.ts file is structured as an object, so i can just
    // plug in the requested count and the property ref does the rest for me.
    // return it as an observable to moc how i would handle an API request
    return of(data[count]);
  }
}
