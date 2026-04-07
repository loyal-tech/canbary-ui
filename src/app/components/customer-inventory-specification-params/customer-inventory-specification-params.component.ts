import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { error } from "console";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { InwardService } from "src/app/service/inward.service";
@Component({
  selector: "app-customer-inventory-specification-params",
  templateUrl: "./customer-inventory-specification-params.component.html",
  styleUrls: ["./customer-inventory-specification-params.component.css"]
})
export class CustomerInventorySpecificationParamsComponent implements OnInit {
  @Input() productData: any;
  @Output() closeInventorySpecModel = new EventEmitter();
  inventorySpecificationDetails: any;
  inventorySpecificationParamModal: boolean = false;
  editedRowIndex: number = -1;
  constructor(
    private inwardService: InwardService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.inventorySpecificationParamModal = true;
    this.addSpecificationParamDetails();
  }

  addSpecificationParamDetails() {
    this.inwardService.getInventoryParamsByMappingID(this.productData.id).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          //   this.specDetailsShow = true;
          this.inventorySpecificationDetails = response.dataList;

          this.inventorySpecificationDetails.map(item => {
            if (item.isMultiValueParam) {
              item.multiValue = item.paramMultiValues.map(value => ({
                label: value,
                value: value
              }));
            }

            return item;
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  isEditing(rowIndex: number): boolean {
    return rowIndex === this.editedRowIndex;
  }

  addOrEditValue(rowIndex: number, id: any, newValue: string, param: any) {
    if (this.editedRowIndex !== -1) {
      this.editedRowIndex = -1;
    } else {
      this.inventorySpecificationDetails.push({
        paramName: "",
        isMandatory: false,
        paramValue: newValue,
        isMultiValueParam: param.isMultiValueParam,
        multiValue: param.multiValue
      });
    }
  }

  closeInventorySpecificationDetailModal() {
    this.inventorySpecificationParamModal = false;
    this.closeInventorySpecModel.emit();
  }

  saveInventorySpecificationParams() {
    let custInvParams = this.inventorySpecificationDetails.map(item => ({
      paramName: item.paramName,
      paramValue: item.paramValue,
      custSerMapId: item.custSerMapId
    }));

    let data = {
      custSerMapId: custInvParams[0].custSerMapId,
      custInvParams: custInvParams,
      custInvId: this.productData.id
    };
    this.inwardService.updateCustomerInventoryParams(this.productData.customerId, data).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "success",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
        this.closeInventorySpecificationDetailModal();
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  editValue(rowIndex: number) {
    this.editedRowIndex = rowIndex;
  }
}
