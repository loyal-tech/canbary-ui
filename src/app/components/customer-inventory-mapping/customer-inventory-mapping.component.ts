import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { InwardService } from "src/app/service/inward.service";
import { OutwardService } from "src/app/service/outward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";

@Component({
  selector: "app-customer-inventory-mapping",
  templateUrl: "./customer-inventory-mapping.component.html",
  styleUrls: ["./customer-inventory-mapping.component.css"],
})
export class CustomerInventoryMappingComponent implements OnInit {
  assignInventory: boolean = false;
  inventoryAssignForm: FormGroup;
  outwardList: any[];
  availableQty: number;
  unit: any;
  products = [];
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];
  submitted: boolean;

  @Input("customerId")
  customerId: number;

  showQtyError: boolean;

  // userId: number = localStorage.getItem('userId');

  userId: number = +localStorage.getItem("userId");
  macList = [];
  selectedMACAddress = [];
  productHasMac: boolean;
  showQtySelectionError: boolean;
  productHasSerial: boolean;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    private outwardService: OutwardService,
    private inwardService: InwardService,
    private productService: ProuctManagementService,
    private customerInventoryMappingService: CustomerInventoryMappingService
  ) {
    this.availableQty = 0;
    // this.inventoryAssignForm.reset();
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["", Validators.required],
      productId: ["", Validators.required],
      customerId: [this.customerId],
      staffId: [""],
      outwardId: ["", Validators.required],
      assignedDateTime: [new Date(), Validators.required],
      status: ["", Validators.required],
      mvnoId: [""],
    });
    this.macList = [];
  }

  ngOnInit(): void {
    this.productService.getAllActiveProduct().subscribe((res: any) => {
      this.products = res.dataList;
    });

    this.inventoryAssignForm.get("qty").valueChanges.subscribe(val => {
      const total = this.availableQty - val;
      if (total < 0) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }

      if (this.productHasMac == true && this.selectedMACAddress.length > val) {
        this.showQtySelectionError = true;
      } else {
        this.showQtySelectionError = false;
      }
    });
  }

  assigneInventory() {
    if (this.inventoryAssignForm.valid && !this.showQtyError && !this.showQtySelectionError) {
      this.outwardService.assignToCustomer(this.mapData()).subscribe(
        (res: any) => {
          if (this.productHasMac || this.productHasSerial) {
            const mappingId = res.data.id;
            this.saveMACMappingWithCustomer(mappingId);
            this.saveCustomerMACMapping();
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Assigend inventory successfully.",
              icon: "far fa-check-circle",
            });
          }

          this.inventoryAssignForm.reset();
          this.availableQty = 0;
          this.showQtyError = false;
          this.showQtySelectionError = false;
          this.inventoryAssignForm.controls.assignedDateTime.setValue(new Date());
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  getOutWardList(productID) {
    const staffId = localStorage.getItem("userId");
    this.outwardList = [];
    this.outwardService.getAllOutwardByProductAndStaff(productID, staffId).subscribe(
      (res: any) => {
        this.outwardList = res.dataList;
        this.productHasMac = this.products.find(element => element.id == productID).hasMac;
        this.productHasSerial = this.products.find(element => element.id == productID).hasSerial;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  async getAvailableQty(id) {
    this.availableQty = this.outwardList.find(element => element.id === id).unusedQty;
    if (this.productHasMac || this.productHasSerial) {
      this.getMacMappingsByInwardId(id);
    }
  }
  getUnit(event) {
    this.unit = this.products.find(element => element.id == event.value).unit;
    this.getOutWardList(event.value);
  }

  mapData() {
    const customerInventoryMapping = this.inventoryAssignForm.getRawValue();
    const mapping = {
      id: null,
      qty: 0,
      productId: 0,
      customerId: this.customerId,
      staffId: this.userId,
      outwardId: 0,
      assignedDateTime: "",
      mvnoId: null,
      status: "",
    };

    mapping.qty = customerInventoryMapping.qty;
    mapping.productId = customerInventoryMapping.productId;
    mapping.outwardId = customerInventoryMapping.outwardId;
    mapping.assignedDateTime = customerInventoryMapping.assignedDateTime;
    mapping.status = customerInventoryMapping.status;

    return mapping;
  }
  getMacMappingsByInwardId(id) {
    this.macList = [];
    this.inwardService.getAllMACMappingByInwardId(id).subscribe((res: any) => {
      this.macList = res.dataList;
    });
  }

  deleteMACMapping(mapping) {
    mapping.customerId = null;
    this.customerInventoryMappingService.deleteMacForCustomer(mapping).subscribe(
      (res: any) => {
        this.deleteMacMappInCustomer(mapping.macAddress);
        this.getMacMappingsByInwardId(mapping.outwardId);
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  saveMACMappingWithCustomer(mappingId) {
    if (this.selectedMACAddress.length > 0) {
      const mappingList = this.macList.filter(val => this.selectedMACAddress.includes(val));
      mappingList.forEach(element => {
        element.customerId = this.customerId;
        element.custInventoryMappingId = mappingId;
      });

      this.outwardService.updateMACMappingList(mappingList).subscribe(
        (res: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Assigend inventory successfully.",
            icon: "far fa-check-circle",
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  saveCustomerMACMapping() {
    const custMacMapping = [];

    this.selectedMACAddress.forEach(element => {
      custMacMapping.push({
        macAddress: element.macAddress,
        customer: this.customerId,
      });
    });

    this.outwardService.saveCustomerMACMapping(custMacMapping).subscribe(
      (res: any) => {
        this.macList = [];
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Successfully',
        //   detail: "Assigend inventory successfully.",
        //   icon: 'far fa-check-circle',
        // });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  deleteMacMappInCustomer(macMaddress) {
    this.outwardService
      .deleteMacMapInCustomer(this.customerId, macMaddress)
      .subscribe((res: any) => {});
  }
  close() {
    this.availableQty = 0;
    // this.inventoryAssignForm.reset();
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["", Validators.required],
      productId: ["", Validators.required],
      customerId: [this.customerId],
      staffId: [""],
      outwardId: ["", Validators.required],
      assignedDateTime: [new Date(), Validators.required],
      status: ["", Validators.required],
      mvnoId: [""],
    });
    this.macList = [];
    this.selectedMACAddress = [];
    this.productHasMac = false;
    this.showQtySelectionError = false;
  }

   closeAssignInventory(){
    this.assignInventory  = false;
   }

}
