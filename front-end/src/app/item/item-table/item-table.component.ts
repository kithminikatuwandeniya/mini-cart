import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ItemService } from '../item.service';
import { Item } from '../../models/item.model';
import { Page } from '../../models/page';
import { SavedItem } from '../../models/savedItem.model';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {
  searchTerm: string = '';

  sortValues: string[] = ['name_item', 'unit', 'description', 'volume'];
  page = 0;
  size = 15;
  sortValue: string = this.sortValues[0];
  direction = 'asc';
  items: any;
  filteredItems: any;
  savedItems: SavedItem[];
  deleteitem: Item;
  modalRef: NgbModalRef;

  constructor(public itemService: ItemService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
  }
  opendelete(content: NgbModal, item) {
    this.deleteitem = item;
    this.modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: "static",
    });
  }

  delete(itemId: number) {
    this.itemService.deleteItem(itemId).subscribe(data => {
      this.ngOnInit();
      this.modalRef.close();
      this.router.navigate(["/item-table"]);
    });
  }

  ngOnInit() {
    this.itemService.findSortedAndPaginatedItems(this.page, this.size, this.sortValue, this.direction).subscribe(data => {
      this.items = data.rows;
      this.filteredItems = this.items;
    });

  }

  onSort(sort: { value: string, direction: string }) {
    this.sortValue = sort.value;
    this.direction = sort.direction;
    this.sort();
  }

  onPaginate() { this.sort(); }
  sort() {
    this.itemService.findSortedAndPaginatedItems(this.page, this.size, this.sortValue, this.direction).subscribe(data => {
      this.items = data.rows;
    });
  }

  onSearch() {
    // Perform the filtering in real-time
    this.filteredItems = this.searchTerm
      ? this.items.filter(item => {
        // Customize the condition based on your search requirements
        return (
          item.name_item.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.price.toString().includes(this.searchTerm) ||
          item.unit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.volume.toString().includes(this.searchTerm)
        );
      })
      : this.items;
  }

  // Method to clear the search term
  clearSearch() {
    this.searchTerm = '';
  }
}
