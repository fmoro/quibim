import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  /** GET users from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(catchError(this.handleError<User[]>('getUsers')));
  }

  /** GET user by id */
  getUser(id: string): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url)
      .pipe(catchError(this.handleError<User>('getUser')));
  }

  //////// Save methods //////////

  /** POST: add a new user to the server */
  createUser(user: User): Observable<string> {
    return this.http.post<string>(this.usersUrl, user, httpOptions)
      .pipe(catchError(this.handleError<string>('createUser')));
  }

  /** PUT: update the user on the server */
  updateUser (user: User): Observable<any> {
    return this.http.put(this.usersUrl, user, httpOptions)
      .pipe(catchError(this.handleError<User>('updateUser')));
  }

  /** DELETE: delete the user from the server */
  deleteUser (user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user._id;
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<User>(url, httpOptions)
      .pipe(catchError(this.handleError<User>('deleteUser')));
  }

  //////// Image methods //////////

  /** GET user image by id */
  downloadUserImage(id: string): Observable<Blob> {
    const url = `${this.usersUrl}/${id}/downloadImage`;
    console.log('hola', url);
    return this.http.get(url, {responseType: 'blob'});
  }

  /** POST: add an user image */
  uploadUserImage(id: string, image: File): Observable<User> {
    const url = `${this.usersUrl}/${id}/uploadImage`;
    const uploadData = new FormData();
    uploadData.append('image', image, image.name);
    return this.http.post<User>(url, uploadData)
      .pipe(catchError(this.handleError<User>('uploadUserImage')));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
