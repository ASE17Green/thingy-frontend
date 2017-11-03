import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AppConfig } from '../../app.config';

import { Observable } from 'rxjs/Observable';

import { ThingyData } from '../models/index';

@Injectable()
export class ThingyService {
    /*
    private contactPagedListUrl = `${AppConfig.apiEndpoint}/contacts`;
    private contactListUrl = `${AppConfig.apiEndpoint}/contacts/list`;
    private contactDetailUrl = `${AppConfig.apiEndpoint}/contacts`;
    private contactCreateUrl = `${AppConfig.apiEndpoint}/contacts/create`;
    private contactDeleteUrl = `${AppConfig.apiEndpoint}/contacts`;
    private contactUpdateUrl = `${AppConfig.apiEndpoint}/contacts/update`;

    private languageListUrl = `${AppConfig.apiEndpoint}/languages/list`;

    constructor(private http: Http) {
    }


    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    private createAuthHeaders(): Headers {
        let token: string = `Bearer ${localStorage.getItem('user_token')}`;
        return new Headers({'Content-Type': 'application/json', 'Authorization': token});
    }

    getContacts(): Observable<ThingyData[]> {
        return this.http
            .get(this.contactListUrl, {headers: this.createAuthHeaders()})
            .map((response: Response) => {
                if(response.ok) {
                    let contacts = response.json().map(contact => {
                        return TypedJSON.parse(JSON.stringify(contact), Contact);
                    });
                    return contacts;
                }
            })
            .catch(this.handleError);
    }

    getContact(id: number): Observable<ThingyData> {
        return this.http
            .get(this.contactDetailUrl + "/" + id, {headers: this.createAuthHeaders()})
            .map((response: Response) => {
                if(response.ok) {
                    return TypedJSON.parse(response.text(), Contact);
                }
            })
            .catch(this.handleError);
    }

    createContact(a: ThingyData): Observable<any> {
        return this.http
            .post(this.contactCreateUrl, JSON.stringify(a), {headers: this.createAuthHeaders()})
            .map((response: Response) => {
                return true;
            })
            .catch(this.handleError);
    }

    deleteContact(id: ThingyData): Observable<boolean> {
        return this.http
            .delete(this.contactDeleteUrl + "/" + id, {headers: this.createAuthHeaders()})
            .map((response: Response) => {
                if(response.ok) {
                    return true;
                }
            })
            .catch(this.handleError);
    }

    updateContact(thingyData: ThingyData): Observable<boolean> {
        return this.http
            .put(this.contactUpdateUrl, JSON.stringify(thingyData), {headers: this.createAuthHeaders()})
            .map((response: Response) => {
                return true;
            })
            .catch(this.handleError);
    }
    */
}
