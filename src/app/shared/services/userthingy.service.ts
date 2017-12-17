import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AppConfig } from '../../app.config';

import { User, ThingyData, Userthingy } from '../models/index';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserthingyService {

    private addUserthingyUrl = `${AppConfig.apiEndpoint}/user/addUserThingy`;
    private getUserthingyUrl = `${AppConfig.apiEndpoint}/user/userThingy`;
    private deleteUserthingyUrl = `${AppConfig.apiEndpoint}/user/delete`;
    private updateUserthingyUrl = `${AppConfig.apiEndpoint}/user/update`;

    constructor(private http: Http) {
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    private createAuthHeader(): Headers {
        let token: string = `${localStorage.getItem('id_token')}`;
        return new Headers({'Content-Type': 'application/json', 'Authorization': token});
    }

    getUserthingyById(id: String): Promise<Userthingy> {
        return this.http.get(this.getUserthingyUrl + '/' + id, {headers: this.createAuthHeader()})
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log('id: ' + id);
                    let test = res.json() as Userthingy;
                    console.log('response: ' + JSON.stringify(test));
                    return res.json() as Userthingy;
                }
            })
            .catch(this.handleError);
    }

    getUserthingys(): Promise<Userthingy[]> {
        return this.http.get(this.getUserthingyUrl, {headers: this.createAuthHeader()})
            .toPromise()
            .then(res => {
                if (res.ok) {
                    return res.json() as Userthingy[];
                }
            })
            .catch(this.handleError);
    }

    addUserthingy(newUserthingy: Userthingy): Promise<Userthingy> {
        return this.http.post(this.addUserthingyUrl, newUserthingy, {headers: this.createAuthHeader()})
            .toPromise()
            .then(res => {
                if (res.ok) {
                    return res.json() as Userthingy ;
                }
            })
            .catch(this.handleError);
    }

    updateUserthingy(putUserthingy: Userthingy): Promise<JSON> {
        return this.http.put(this.updateUserthingyUrl + '/' + putUserthingy.thingyID, putUserthingy, { headers: this.createAuthHeader() })
            .toPromise()
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .catch(this.handleError);
    }

    deleteUserthingy(id: String): Promise<JSON> {
        return this.http.delete(this.deleteUserthingyUrl + '/' + id, { headers: this.createAuthHeader() })
            .toPromise()
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .catch(this.handleError);
    }
}
