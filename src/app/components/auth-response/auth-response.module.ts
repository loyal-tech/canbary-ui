import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AuthResponseComponent } from "./auth-response.component";

const routes = [{ path: "", component: AuthResponseComponent }];

@NgModule({
  declarations: [AuthResponseComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class AuthResponseModule {}
