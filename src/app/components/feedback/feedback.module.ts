import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { FeedbackComponent } from "./feedback.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: FeedbackComponent }];

@NgModule({
  declarations: [FeedbackComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule]
})
export class FeedbackModule {}
