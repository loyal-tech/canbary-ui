import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomerCafComponent } from "./customer-caf.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { DialogModule } from "primeng/dialog";

const routes = [{ path: "", component: CustomerCafComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [CustomerCafComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class CustomerCafModule {}
