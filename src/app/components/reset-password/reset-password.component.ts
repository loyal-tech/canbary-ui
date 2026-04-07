import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { Title } from "@angular/platform-browser";
import { TITLE } from "../../RadiusUtils/RadiusConstants";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "src/app/service/login.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  generatePasswordForm: FormGroup;
  submitted = false;
  showPassword: boolean = false;
  uuId: any;
  staffId: string;

  constructor(
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private titleService: Title,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.uuId = this.route.snapshot.paramMap.get("uuId")!;
    this.staffId = this.route.snapshot.paramMap.get("staffId")!;
  }

  ngOnInit(): void {
    localStorage.setItem("hostName", window.location.hostname);
    this.primengConfig.ripple = true;
    this.titleService.setTitle(TITLE);
    this.generatePasswordForm = this.fb.group(
      {
        userName: ["", Validators.required],
        oldPassword: ["", Validators.required],
        newPassword: ["", Validators.required],
        confirmpassword: ["", Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.controls["newPassword"].value ===
      form.controls["confirmpassword"].value
      ? null
      : { mismatch: true };
  }

  savePassword() {
    this.submitted = true;
    if (this.generatePasswordForm.invalid) {
      return;
    }

    this.loginService.resetPassword(this.generatePasswordForm.value).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle",
          });

          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 1000);
        }
      },
      (error) => {
        if (error.error.status === 409) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: error.error.msg,
            icon: "far fa-check-circle",
          });
        } else if (error.error.status === 417) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: error.error.responseMessage,
            icon: "far fa-check-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "error",
            detail: error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }
}
