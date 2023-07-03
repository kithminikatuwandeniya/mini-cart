import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Item } from '../../models/item.model';
import { Page } from '../../models/page';
import { SavedItem } from '../../models/savedItem.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { UsersService } from '../users.service';
import { User } from 'src/app/models/user.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  modalRef: NgbModalRef;
  sortValues: string[] = ['firstname', 'lastname', 'email', 'role'];
  page = 0;
  size = 15;
  sortValue: string = this.sortValues[0];
  direction = 'asc';
  users: any;
  savedItems: SavedItem[];
  user_selected: User;
  filteredItems:any;
  searchTerm: string = '';

  constructor(public userService: UsersService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
  }

  openDelete(user: any, content: NgbModal) {
    this.user_selected = user;
    this.modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: "static",
    });
  }

  delete(userId: number) {
    this.userService.deleteUser(userId).subscribe(data => {
      this.sort();
      this.modalRef.close();
      this.router.navigate(['home', { outlets: { nav: ['users'] } }]);
    });
  }

  ngOnInit() {
    this.userService.findSortedAndPaginatedUsers(this.page, this.size, this.sortValue, this.direction).subscribe(data => {
      this.users = data.rows;
      this.filteredItems = this.users
    });
  }

  onSort(sort: { value: string, direction: string }) {
    this.sortValue = sort.value;
    this.direction = sort.direction;
    this.sort();
  }

  onPaginate() { this.sort(); }
  sort() {
    this.userService.findSortedAndPaginatedUsers(this.page, this.size, this.sortValue, this.direction).subscribe(data => {
      this.users = data.rows;
    });
  }

  onSearch() {
    // Perform the filtering in real-time
    this.filteredItems = this.searchTerm
      ? this.users.filter(item => {
          // Customize the condition based on your search requirements
          return (
            item.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            item.last_name.toString().includes(this.searchTerm) ||
            item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) 
          );
        })
      : this.users;
  }
  
  // Method to clear the search term
  clearSearch() {
    this.searchTerm = '';
  }
}