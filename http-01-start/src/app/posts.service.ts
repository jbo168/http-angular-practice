import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';

import { map, catchError, tap } from 'rxjs/operators'
import { Subject, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
    error = new Subject<string>();
    
    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content}
        this.http
        .post<{ name:string }>(
          'https://angular-course-project-834ca.firebaseio.com/posts.json',
          postData,
          {
            observe: 'body'
          }
        )
        .subscribe(responseData => {
          console.log(responseData);
        }, error => {
            this.error.next(error.message);
        });
    }

    fetchPosts() {
        return this.http
        .get<{ [key: string]: Post }>(
            'https://angular-course-project-834ca.firebaseio.com/posts.json',
            {
              headers: new HttpHeaders({'Custom-Header': 'Hello'}),
              params: new HttpParams().set('print', 'pretty')
            }
        )
        .pipe(
          map(responseData => {
            const postsArray: Post[] = [];
            for(const key in responseData) {
              if(responseData.hasOwnProperty(key)){
                postsArray.push({...responseData[key], id: key});
              }
            }
            return postsArray;
          }),
          catchError(errorRes => {
              // some generic error handling task goes here
            return   throwError(errorRes);
          })
        );
    }

    deletePosts() {
      return this.http.delete(
        'https://angular-course-project-834ca.firebaseio.com/posts.json',
        {
          observe: 'events'
        }
      ).pipe(tap(event => {
        console.log(event);
        if (event.type == HttpEventType.Sent) {
          // ...
        }
        if (event.type == HttpEventType.Response) {
          console.log(event.body);
        }
      }));
    }
    
}