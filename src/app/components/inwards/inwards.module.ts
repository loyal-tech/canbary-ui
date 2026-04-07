import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { InwardsComponent } from "./inwards.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { DialogModule } from "primeng/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
const routes = [{ path: "", component: InwardsComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [InwardsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class InwardsModule {}
