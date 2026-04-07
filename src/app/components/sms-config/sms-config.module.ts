import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { SmsConfigComponent } from "./sms-config.component";

const routes = [{ path: "", component: SmsConfigComponent }];

@NgModule({
  declarations: [SmsConfigComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SmsConfigModule {}
