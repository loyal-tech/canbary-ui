import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TargetManagementComponent } from "./target-management.component";

const routes = [{ path: "", component: TargetManagementComponent }];

@NgModule({
  declarations: [TargetManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TargetManagementModule {}
