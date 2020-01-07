import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:3003/api/people';
const apiUrlcep = 'https://viacep.com.br/ws';// /37145000/json/

const _httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers':
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  
  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error('erro status: ',error.status, 'err: ',JSON.stringify(error.error))
    }
    if(`${error.error}`=='Fail -> Email is already in use!')    
        return throwError('Já existe alguém cadastrado com esse e-mail!');
    if(`${error.error}`=='Fail -> Password is already in use!')    
        return throwError('Já existe alguém cadastrado com essa senha da casa!')
    return throwError('Algum erro não identificado ocorreu!');
  }
  
  extractData(res: Response) {
    let body = res;
    return body || { };
  }
  
  getUser(role?, search?): Observable<any> {
    const url =  `${apiUrl}?role=${role}&&search=${search}`;
    console.log('url',url)
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  
  getUserById(id: string): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getUserFilterName(search): Observable<any>
  {
    const url = `${apiUrl}?search=${search}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError))
  }
  
  postUser(data): Observable<any> {
    const url = `${apiUrl}`;
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  updateUser(id, data): Observable<any> {
    const url = `${apiUrl}/${id}`;
    console.log(data)
    return this.http.put(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  deleteUser(id): Observable<{}> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

 getCep(cep): Observable<any>
  {
    const url = `${apiUrlcep}/${cep}/json/`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError))
  }
}
