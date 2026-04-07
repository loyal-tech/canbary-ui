import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomerCafNewComponent } from "./customer-caf-new.component";
import { DialogModule } from "primeng/dialog";
import { CustomerCafRoutingModule } from "./customer-caf-new-routing.module";
import { CustomerCafListComponent } from "./customer-caf-list/customer-caf-list.component";
import { CustomerCafCreateComponent } from "./customer-caf-create/customer-caf-create.component";

@NgModule({
  declarations: [CustomerCafNewComponent, CustomerCafListComponent, CustomerCafCreateComponent],
  imports: [
    CommonModule,
    CustomerCafRoutingModule,
    // RouterModule.forChild(routes),
    SharedModule,
    DialogModule
  ]
})
export class CustomerCafNewModule {}
