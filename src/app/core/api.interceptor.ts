import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor} from '@angular/common/http';
import {HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
constructor() { }
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith(environment.serverUrl)) {
            const clonedRequest = req.clone({
                withCredentials: true,
            });
            return next.handle(clonedRequest);
        } else {
            return next.handle(req);
        }
}
}
