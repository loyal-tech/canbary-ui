import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ProductCategoryManagementComponent } from "./product-category-management.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DialogModule } from "primeng/dialog";

const routes = [
  { path: "", component: ProductCategoryManagementComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [ProductCategoryManagementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    HttpClientModule,
    SharedModule,
    DialogModule,
  ],
})
export class ProductCategoryManagementModule {}
