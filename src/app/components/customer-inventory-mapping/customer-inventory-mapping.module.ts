import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { CustomerInventoryMappingComponent } from "./customer-inventory-mapping.component";

const routes = [{ path: "", component: CustomerInventoryMappingComponent }];

@NgModule({
  declarations: [CustomerInventoryMappingComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CustomerInventoryMappingModule {}
