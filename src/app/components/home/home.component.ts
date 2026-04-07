import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { LoginService } from "src/app/service/login.service";
import { SidebarService } from "src/app/service/sidebar.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(
    private snack: MatSnackBar,
    public sidebarService: SidebarService,
    public loginService: LoginService,
    public statusCheckService: StatusCheckService
  ) {}

  ngOnInit(): void {
    this.statusCheckService.getServiceStatus();
    // this.loginService.getAclEntry();
  }

  roleButtonClick() {
    this.snack.open("Role button clicked", "cancel");
  }
}
