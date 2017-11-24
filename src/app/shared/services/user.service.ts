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
    private updateUserUrl = `${AppConfig.apiEndpoint}/user/update`;
    private getUserUrl = `${AppConfig.apiEndpoint}/user/profile`;

    constructor(private http: Http) { }

    /*
     * CRUD methods
     */


    private createAuthHeader(): Headers {
        let token: string = `${localStorage.getItem('id_token')}`;
        return new Headers({'Content-Type': 'application/json', 'Authorization': token});
    }

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

    updateUser(putUser: User): Promise<JSON> {

        const body = JSON.stringify(putUser);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        console.log("Update User with ID: "+ putUser._id);
        return this.http.put(this.updateUserUrl, body, { headers: this.createAuthHeader() })
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log(res.json());
                    return res.json();
                }
            })
            .catch(this.handleError);
    }

    getUser(): Promise<any> {
        return this.http.get(this.getUserUrl, { headers: this.createAuthHeader() })
            .toPromise()
            .then(res => {
                return res.json().user as User;
            })
            .catch(this.handleError);
    }
    /*
    getUser(): Promise<User> {
        return this.http.get(this.getUserUrl, {headers: this.createAuthHeader()})
            .toPromise()
            .then(response => {
                if(response.ok) {
                    console.log(response.json())
                    return response.json() as User;
                }
            })
            .catch(this.handleError);
    }*/

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
    */



    // error handling
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
    }
}
