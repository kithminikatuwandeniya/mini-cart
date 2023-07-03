import { Component, OnInit } from '@angular/core';
import { ItemService } from "../item.service";
import { Item } from "../../models/item.model";


@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
  public item: Item = new Item();
  public itemResult: Item;
  public errorVal ="";
  constructor(private itemService: ItemService) { }

  ngOnInit() {
  }

  createItem() {
    if(this.item.name!=='' && this.item.price!==0 && this.item.description!=='' && this.item.unit!==''){
      this.itemService.addItem(this.item).subscribe(data => {
        this.itemResult = data;
        this.itemService.goToUpdateItem(this.itemResult.id);
      },error=>{
        this.errorVal = "Please fill all the fields";
      });
    }else{
      this.errorVal = "Please fill all the fields";
    }
    
  }
}
