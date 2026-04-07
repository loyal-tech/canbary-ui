import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { OutwardsComponent } from "./outwards.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { DialogModule } from "primeng/dialog";
const routes = [{ path: "", component: OutwardsComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [OutwardsComponent],
  imports: [CommonModule, DialogModule, RouterModule.forChild(routes), SharedModule],
})
export class OutwardsModule {}
