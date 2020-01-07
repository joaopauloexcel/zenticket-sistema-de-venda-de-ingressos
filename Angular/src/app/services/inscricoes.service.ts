  import { Injectable } from '@angular/core';
  import { Observable, of, throwError } from 'rxjs';
  import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
  import { catchError, tap, map } from 'rxjs/operators';
  
  const apiUrl = 'http://localhost:3003/api/subscription';
  const httpOptions = {
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
  export class InscricoesService {
  
    
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
      return throwError('Algum erro não identificado ocorreu!');
    }
    
    extractData(res: Response) {
      let body = res;
      return body || { };
    }

    exportPDF(id){
      const url=`${apiUrl}/report/${id}`
      window.open(url)
    }
    
    getInscricao(search?): Observable<any> {
      const url = `${apiUrl}?search=${search}`
      return this.http.get(url, httpOptions).pipe(
        map(this.extractData),
        catchError(this.handleError));
    }
  
    saveInscricao(data, userEmail, eventId): Observable<any> {
        const url = `${apiUrl}?userEmail=${userEmail}&&eventId=${eventId}`;
        console.log(url)
        return this.http.post(url, data, httpOptions)
          .pipe(
            catchError(this.handleError)
          );
    }
    
    deleteInscricao(id: string): Observable<{}> {
      const url = `${apiUrl}/${id}`;
      console.log(url)
      return this.http.delete(url, httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }
  }
  

