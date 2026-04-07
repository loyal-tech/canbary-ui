import { Component, OnInit } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute } from "@angular/router";
import { ProfileService } from "src/app/service/profile.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  profileTitle = RadiusConstants.PROFILE;
  isShowCreateView: boolean = true;
  isShowListView: boolean = true;
  isShowMenu: boolean = true;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPage = 1;
  searchkey: string;
  profileListData: any;
  totalRecords: any;
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    if (childUrlSegment === "list") {
      this.isShowMenu = true;
      this.isShowListView = true;
      this.isShowCreateView = false;
    } else if (childUrlSegment === "create" || childUrlSegment === "edit") {
      this.isShowMenu = true;
      this.isShowCreateView = true;
      this.isShowListView = false;
    } else {
      this.isShowMenu = false;
      this.isShowCreateView = false;
      this.isShowListView = false;
    }
  }

  createClick() {
    this.isShowMenu = true;
    this.isShowCreateView = true;
    this.isShowListView = false;
  }

  searchClick() {
    this.isShowMenu = true;
    this.isShowListView = true;
    this.isShowCreateView = false;
  }
}
