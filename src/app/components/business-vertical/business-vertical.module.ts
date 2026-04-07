import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { BusinessVerticalComponent } from "./business-vertical.component";

const routes = [{ path: "", component: BusinessVerticalComponent }];

@NgModule({
  declarations: [BusinessVerticalComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class BusinessVerticalModule {}
