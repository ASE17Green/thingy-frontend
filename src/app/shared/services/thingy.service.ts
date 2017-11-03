import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AppConfig } from '../../app.config';

import { User, ThingyData } from '../models/index';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ThingyService {

    private thingyDataCompleteUrl = `${AppConfig.apiEndpoint}/user/thingy/data`;

    constructor(private http: Http) {
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    private createAuthHeader(): Headers {
        let token: string = `${localStorage.getItem('id_token')}`;
        return new Headers({'Content-Type': 'application/json', 'Authorization': token});
    }

    getThingyDataComplete(): Promise<ThingyData[]> {
        let headers = new Headers
        return this.http.get(this.thingyDataCompleteUrl, {headers: this.createAuthHeader()})
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log(res.json());
                    return res.json() as ThingyData[];
                }
            })
            .catch(this.handleError);
    }
}
