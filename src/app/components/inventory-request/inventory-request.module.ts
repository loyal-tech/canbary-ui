import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { InventoryRequestComponent } from "./inventory-request.component";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: InventoryRequestComponent }];

@NgModule({
  declarations: [InventoryRequestComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class InventoryRequestModule {}
