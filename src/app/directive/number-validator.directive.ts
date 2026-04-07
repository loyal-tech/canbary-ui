import { Directive, HostListener, Input, Optional, ElementRef } from "@angular/core";
import { NgModel } from "@angular/forms";

@Directive({
  selector: "[appNumberValidator]"
})
export class NumberValidatorDirective {
  @Input() allowNegative: boolean = false;
  @Input() allowDecimal: boolean = true;
  @Input() minValue: number | null = null;
  @Input() maxValue: number | null = null;

  private updatingModel = false;

  constructor(
    private el: ElementRef,
    @Optional() private ngModel: NgModel
  ) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    const char = event.key;

    if (!this.allowNegative && (char === "-" || char === "+")) {
      event.preventDefault();
    }

    if (!this.allowDecimal && char === ".") {
      event.preventDefault();
    }

    // Allow control keys (backspace, arrows, delete, etc.)
    if (
      ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(char) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    // Only allow numbers and (optionally) one dot
    const regex = this.allowDecimal ? /^[0-9.]$/ : /^[0-9]$/;
    if (!regex.test(char)) {
      event.preventDefault();
    }

    if (char === "." && this.el.nativeElement.value.includes(".")) {
      event.preventDefault();
    }
  }

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData("text") || "";

    if (!this.allowNegative && pasted.includes("-")) {
      event.preventDefault();
    }

    if (!this.allowDecimal && pasted.includes(".")) {
      event.preventDefault();
    }

    if (!/^[0-9.+-]*$/.test(pasted)) {
      event.preventDefault();
    }
  }

  @HostListener("ngModelChange", ["$event"])
  onModelChange(value: any) {
    if (this.updatingModel || value === null || value === undefined || value === "") return;

    let numberValue = parseFloat(value);

    if (!this.allowNegative && numberValue < 0) {
      numberValue = 0;
    }

    if (this.minValue !== null && numberValue < this.minValue) {
      numberValue = this.minValue;
    }

    if (this.maxValue !== null && numberValue > this.maxValue) {
      numberValue = this.maxValue;
    }

    if (this.ngModel && this.ngModel.model !== numberValue) {
      this.updatingModel = true;
      this.ngModel.control?.setValue(numberValue);
      setTimeout(() => {
        this.updatingModel = false;
      }, 0);
    }
  }
}
