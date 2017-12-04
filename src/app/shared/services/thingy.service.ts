import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AppConfig } from '../../app.config';

import { User, ThingyData } from '../models/index';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ThingyService {

    private thingyByIdUrl = `${AppConfig.apiEndpoint}/user/thingy/data`;
    private newThingyDataUrl = `${AppConfig.apiEndpoint}/user/thingy/data`;
    private lastThingyByIdUrl = `${AppConfig.apiEndpoint}/user/thingy/lastdata`;

    constructor(private http: Http) {
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    private createAuthHeader(): Headers {
        let token: string = `${localStorage.getItem('id_token')}`;
        return new Headers({'Content-Type': 'application/json', 'Authorization': token});
    }

    getThingyById(id: String): Promise<ThingyData[]> {
        return this.http.get(this.thingyByIdUrl + '/' + id, {headers: this.createAuthHeader()})
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log(res.json());
                    return res.json() as ThingyData[];
                }
            })
            .catch(this.handleError);
    }

    getLastEntry(): Promise<ThingyData> {
        return this.http.get(this.lastThingyByIdUrl, {headers: this.createAuthHeader()})
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log(res.json());
                    return res.json() as ThingyData;
                }
            })
            .catch(this.handleError);
    }

    createNewThingyDataset(newThingy: ThingyData): Promise<JSON> {
        return this.http.post(this.newThingyDataUrl, newThingy, {headers: this.createAuthHeader()})
            .toPromise()
            .then(res => {
                if (res.ok) {
                    console.log(res.json());
                    return res.json();
                }
            })
            .catch(this.handleError);
    }
}
