import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/item/item.service';
import { Item } from 'src/app/models/item.model';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs/internal/operators/tap';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.css']
})

export class CreateBillComponent implements OnInit {
  @ViewChild('screen', { static: true }) screen: any;
  searchTerm: string = '';

  sortValues: string[] = ['name_item', 'unit', 'description', 'volume']
  direction = 'asc';
  items: any;
  filteredItems = [];
  selectedValue: any;
  billedItems = [];
  todayISOString: string = new Date().toISOString();
  invoideNo: number = Date.now();
  total = 0.0;
  remaining = 0.0;
  paidAmount = 0.0;
  modalRef: NgbModalRef;
  imgBase64 = '';

  constructor(public itemService: ItemService, private router: Router, private route: ActivatedRoute,
    private captureService: NgxCaptureService, private http: HttpClient, @Inject('BASE_API_URL') private baseUrl,
    private modalService: NgbModal) { }


  ngOnInit(): void {
    this.itemService.getAllItems().subscribe(data => {
      this.items = data.rows;
    });
  }


  capture(content: NgbModal) {
    this.captureService
      .getImage(this.screen.nativeElement, true)
      .then((img) => {
        this.imgBase64 = img;
        this.downloadJson(content);
      });
  }

  downloadJson(content: NgbModal) {

    const fileData = this.imgBase64;
    const apiUrl = this.baseUrl + '/bills/download';

    this.http.post(apiUrl, { fileData: fileData, name: this.invoideNo.toString() + ".png" }).subscribe(
      () => {
        this.modalRef = this.modalService.open(content, {
          centered: true,
          backdrop: "static",
        });
      },
      (error) => {
        console.error('Error downloading file', error);
      }
    );

    // var element = document.createElement('a');
    // element.setAttribute('href', this.imgBase64);
    // element.setAttribute('download', this.invoideNo.toString());
    // element.style.display = 'none';
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  selectedItemBill(i) {
    let itemId = this.billedItems[i].value;
    for (let k = 0; k < this.items.length; k++) {
      if (this.items[k].id == itemId) {
        this.billedItems[i] = this.items[k]
        this.items.splice(k, 1);
      }
    }
  }

  totalChange() {
    this.total = 0;
    for (let i = 0; i < this.billedItems.length; i++) {
      this.total += (this.billedItems[i].price) * (this.billedItems[i].volume);
    }
  }

  remainingChange() {
    this.remaining = this.total - this.paidAmount;
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

  addRow() {
    this.billedItems.push({ value: "" });
  }


  removeRow(i) {
    this.billedItems.forEach((element, i) => {
      this.billedItems[i].volume = 0;
      this.items.push(this.billedItems[i]);
      this.billedItems.splice(i, 1);
    });
    this.totalChange();
  }
  // Method to clear the search term
  clearSearch() {
    this.searchTerm = '';
    this.filteredItems = [];
  }

}