import { Component, OnInit } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-password-policy",
  templateUrl: "./password-policy.component.html",
  styleUrls: ["./password-policy.component.css"],
})
export class PasswordPolicyComponent implements OnInit {
  isShowCreateView: boolean = true;
  isShowListView: boolean = true;
  isShowMenu: boolean = true;
  public loginService: LoginService;
  constructor(private route: ActivatedRoute, loginService: LoginService) {
    this.loginService = loginService;
  }

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
