import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ButtonModule } from "primeng/button";
import { AccessControlListComponent } from "./access-control-list.component";

const routes = [{ path: "", component: AccessControlListComponent }];
@NgModule({
  declarations: [AccessControlListComponent],
  imports: [CommonModule, ButtonModule, RouterModule.forChild(routes), SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccessControlListModule {}
