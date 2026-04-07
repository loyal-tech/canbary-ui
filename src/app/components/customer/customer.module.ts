import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { TabViewModule } from "primeng/tabview";
import { CardModule } from "primeng/card";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerCreateComponent } from "./customer-create/customer-create.component";
import { CustomerComponent } from "./customer.component";
import { DialogModule } from "primeng/dialog";

// const routes = [{ path: "", component: CustomerComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    TabViewModule,
    CardModule,
    DialogModule,
  ],
  declarations: [CustomerComponent, CustomerListComponent, CustomerCreateComponent],
})
export class CustomerModule {}
