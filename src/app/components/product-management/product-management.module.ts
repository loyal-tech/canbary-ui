import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ProductManagementComponent } from "./product-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [
  { path: "", component: ProductManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [ProductManagementComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ProductManagementModule {}
