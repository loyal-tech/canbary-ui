import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
@Component({
    selector: "app-search-details",
    templateUrl: "./search-details.component.html",
    styleUrls: ["./search-details.component.scss"]
})
export class SearchDetailComponent {

  @Input() placeholder: string = 'Global Search Filter';
  @Input() searchValue: string = '';

  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
    
   onSearch() {
    this.search.emit(this.searchValue);
  }

  onClear() {
    this.searchValue = '';
    this.clear.emit();
  }
}
   


    