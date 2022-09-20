import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {parse} from 'yaml';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class GetYamlService {
  object:any = {};
  // the constructor injects the HttpClient service
  constructor(private http: HttpClient) {
    // this.fetchYaml('light_control.yaml');
  }

  public fetchYaml(fileName: any) {
    // if you wonder about the string syntax, read https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    this.http.get(`/assets/${fileName}`, { responseType: 'text' }).subscribe(response => {
      let lines: string[] = response.split('\n');  // create array where each YAML line is one entry
      this.object = {};
      lines.forEach((line: string) => {
        let delimiter = line.indexOf(':');  // find the colon position inside the line string
        let key = line.substr(0, delimiter);  // extract the key (everything before the colon)
        let value = line.substr(delimiter + 1);  // extract the value (everything after the colon)
        // console.log(value)
        this.object[key] = value;  // add a new key-value pair to the object
      });
      console.log(this.object)
    });
  }

  public getJson(fileName: any): Observable<any> {
    return this.http.get(`assets/${fileName}`, {
      observe: 'body',
      responseType: "text"   // This one here tells HttpClient to parse it as text, not as JSON
    }).pipe(
      // Map Yaml to JavaScript Object
      map(yamlString => parse(yamlString))
    );
  }
}
