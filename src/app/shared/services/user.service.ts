import { Injectable } from '@angular/core';
import { User } from '../models/index';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../../app.config';
import 'rxjs/add/operator/toPromise';   // this adds the non-static 'toPromise' operator
import 'rxjs/add/operator/map';         // this adds the non-static 'map' operator
import 'rxjs/add/operator/switchMap';   // this adds the non-static 'switchMap' operator

@Injectable()
export class UserService {
    private createUserUrl = `${AppConfig.apiEndpoint}/user/register`;
    private authenticateUserUrl = `${AppConfig.apiEndpoint}/user/authenticate`;
    private getUsersUrl = `${AppConfig.apiEndpoint}/user/`;

    constructor(private http: Http) { }

    /*
     * CRUD methods
     */

    /*
    getUsers(): Promise<User[]> {
        return this.http.get(this.getUsersUrl)
            .toPromise()
            .then(response => response.json() as User[])
            .catch(this.handleError);
    }*/

    createUser(newUser: User): Promise<JSON> {
        console.log(newUser);
        return this.http.post(this.createUserUrl, newUser)
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log(res.json());
                    return res.json();
                }
            })
            .catch(this.handleError);
    }

    authenticateUser(user: User): Promise<JSON> {
        return this.http.post(this.authenticateUserUrl, user)
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log(res.json());
                    return res.json();
                }
            })
            .catch(this.handleError);
    }

    storeUserData(token: string, user: string): void {
        localStorage.setItem('isLoggedin', 'true');
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    clearUserData(): void {
        localStorage.clear();
    }

    /*
    getTageler(id: String): Promise<Tageler> {
        return this.http.get(this.tagelersUrlGetById + '/' + id)
            .toPromise()
            .then(response => response.json() as Tageler)
            .catch(this.handleError);
    }

    // delete("/api/v1/tageler/admin/delete")
    deleteTageler(delTageler: String): Promise<JSON> {
        var fd:FormData = new FormData();
        fd.append('_id', delTageler);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });

        console.log("delete tageler with ID: "+delTageler);
        return this.http.delete(this.tagelerUrlDelete+'/'+delTageler,options)
            .toPromise()
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .catch(this.handleError);
    }

    // put("/api/v1/tageler/admin/update")
    updateTageler(putTageler: Tageler): Promise<JSON> {

        const body = JSON.stringify(putTageler);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        console.log("Update tageler with ID: "+ putTageler._id);
        return this.http.put(this.tagelerUrlUpdate+'/'+putTageler._id, body, { headers: headers })
            .toPromise()
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .catch(this.handleError);
    }
    */


    // error handling
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
    }
}
