import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AssignedInventoryComponent } from "./assigned-inventory.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: AssignedInventoryComponent }];

@NgModule({
  declarations: [AssignedInventoryComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule, DialogModule],
})
export class AssignedInventoryModule {}
