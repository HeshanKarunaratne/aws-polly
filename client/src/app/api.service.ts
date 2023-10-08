import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  ENDPOINT = 'https://vcgy33dckl.execute-api.us-east-1.amazonaws.com/dev/speak';

  constructor(private http: HttpClient) { }

  speak(data: any) {
    return this.http.post(this.ENDPOINT, data);
  }
}
