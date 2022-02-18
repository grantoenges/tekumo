import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IServerResponse} from '../models/IServerResponse';
import {ICustomerBillingRate} from '../models/ICustomerBillingRate';
@Injectable({
  providedIn: 'root'
})

export class CustomerBillingRatesService {
  constructor(private readonly http: HttpClient) {
  }

  getAllCustomerBillingRates(sort, selectedCustomerId): Observable<IServerResponse<any>> {
    let requestPath = `api/v2/customer-billing-rate?view=${sort}`;
    if (selectedCustomerId) {
      requestPath += `&customer_id=${selectedCustomerId}`;
    }
    return this.http.get<IServerResponse<ICustomerBillingRate[]>>(requestPath);
  }

  updateCustomerBillingRate(data): Observable<IServerResponse<any>> {
    const requestPath = `api/v2/customer-billing-rate/update`;
    return this.http.put<any>(requestPath, data);
  }

  createNewCustomerBillingRate(data): Observable<IServerResponse<any>> {
    const requestPath = `api/v2/customer-billing-rate`;
    return this.http.post<IServerResponse<any>>(requestPath, data);
  }
  getAppropriateBillingRate(customerId: number, projectId: number, slaTypeId: number): Observable<IServerResponse<ICustomerBillingRate>> {
    const requestPath = `api/v2/customer-billing-rate/appropriate-billing-rate?customerId=${+customerId}&projectId=${+projectId}&slaTypeId=${+slaTypeId}`;
    return this.http.get<IServerResponse<ICustomerBillingRate>>(requestPath);
  }

}
