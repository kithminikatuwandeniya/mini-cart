import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from '../models/item.model';
import { SavedItem } from '../models/savedItem.model';
import { Page } from "../models/page";
import { Observable } from "rxjs";
import { ItemTransactionRequest } from "../models/itemTransactionRequest.model";
import { AssociateType } from "../models/associate-type.enum";
import { SavedItemAssociateModel } from "../models/savedItemAssociate.model";
import { UsefulWarehouseModel } from "../models/usefulWarehouse.model";
import { ActivatedRoute, Router } from "@angular/router";


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(@Inject('BASE_API_URL',) private baseUrl: string, private http: HttpClient,
    private activatedRoute: ActivatedRoute, private router: Router) {
  }

  public findSortedAndPaginatedItems(page: number, size: number, sort: string, direction: string) {
    return this.http.get<any>(this.baseUrl + '/item?page=' + page + '&size=' + size + '&sort=' + sort + '&direction=' + direction);
  }

  public getAllItems() {
    return this.http.get<any>(this.baseUrl + '/item/all');
  }

  public addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl + '/item/add-item', item);
  }
  public addSavedItem(itemTransactionRequest: ItemTransactionRequest): Observable<SavedItem> {
    return this.http.post<SavedItem>(this.baseUrl + '/savedItems', itemTransactionRequest);
  }
  public getSavedItemsByItemId(itemId: number) {
    return this.http.get<Array<SavedItem>>(this.baseUrl + '/savedItems/itemId/' + itemId);
  }
  public getSavedItemsById(itemId: number) {
    return this.http.get<SavedItem>(this.baseUrl + '/savedItems/' + itemId);
  }
  public getItemById(itemId: number): Observable<Item> {
    return this.http.get<Item>(this.baseUrl + '/item/' + itemId);
  }
  public deleteItem(itemId: number) {
    return this.http.delete(this.baseUrl + '/item/' + itemId);
  }
  public updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(this.baseUrl + '/item', item);
  }
  public moveSavedItem(item: ItemTransactionRequest): Observable<SavedItem> {
    return this.http.put<SavedItem>(this.baseUrl + '/savedItems/move', item);
  }
  public outSavedItem(item: ItemTransactionRequest): Observable<SavedItem> {
    return this.http.put<SavedItem>(this.baseUrl + '/savedItems/outcome', item);
  }
  public searchItemsByNameQuery(query: string) {
    return this.http.get<Item[]>(this.baseUrl + '/items/name?q=' + query);
  }


  goToAddItem() {
    this.router.navigate(['home', { outlets: { nav: ['create-item'] } }]);
  }
  goToUpdateItem(itemId: number) {
    this.router.navigate(['home', { outlets: { nav: ['update-item', itemId] } }]);
  }
  goToCreateSavedItem(itemId: number) {
    this.router.navigate(['home', { outlets: { nav: ['create-savedItem', itemId] } }]);
  }
  goToMoveSavedItem(itemId: number, savedItemId: number) {
    this.router.navigate(['home', { outlets: { nav: ['move-savedItem', itemId, savedItemId] } }]);
  }
  goToOutSavedItem(itemId: number, savedItemId: number) {
    this.router.navigate(['home', { outlets: { nav: ['out-savedItem', itemId, savedItemId] } }]);
  }
}
