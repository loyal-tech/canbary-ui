import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ButtonModule } from "primeng/button";
import { TacacsAuthenticationAuditComponent } from "./tacacs-authentication-audit.component";



const routes = [{ path: "", component: TacacsAuthenticationAuditComponent }];
@NgModule({
  declarations: [TacacsAuthenticationAuditComponent],
  imports: [CommonModule, ButtonModule, RouterModule.forChild(routes), SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TacacsAuthenticationAuditModule {}
