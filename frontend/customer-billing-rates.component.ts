import {ChangeDetectorRef, Component, Injectable, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { CustomerBillingRatesService} from '../../../../../common/services/customer-billing-rates.service';
import {ICustomerBillingRate} from '../../../../../common/models/ICustomerBillingRate';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {CustomerBillingRatesDialogComponent} from './customer-billing-rates-dialog/customer-billing-rates-dialog.component';
import {BroadcastEvents} from '../../../../../common/enums/broadcast-events.enum';
import {EventBroadcastService} from '../../../../../common/services/event-broadcast.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/operators';
import {CustomerService} from '../../../../../common/services/customer.service';

@Component({
  selector: 'app-customer-billing-rates',
  templateUrl: './customer-billing-rates.component.html',
  styleUrls: ['./customer-billing-rates.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CustomerBillingRatesComponent implements OnInit {

  @ViewChildren('innerTables') innerTables: any;

  subMenuTitle = 'Customer Billing Rates';
  sort = 'global';
  selectedCustomerId: number;
  customerList;
  isLoading: boolean;
  customerBillingRates: ICustomerBillingRate[];
  customerBillingRatesForm: FormGroup;
  displayedColumnsGlobal = ['slaName', 'fixedHourlyRate', 'fixedHours', 'additionalHourlyRate', 'additionalHours'];
  displayedColumnsCustomer = ['Customer'];
  innerCustomerColumn = ['slaName', 'fixedHourlyRate', 'fixedHours', 'additionalHourlyRate', 'additionalHours'];
  projectColumns = ['projectName', 'slaName', 'fixedHourlyRate', 'fixedHours', 'additionalHourlyRate', 'additionalHourlyRate', 'additionalHours'];
  expandedElement: any | null;
  slaCodesList: any;

  constructor(private cbrService: CustomerBillingRatesService,
              public dialog: MatDialog,
              private eventBroadcastService: EventBroadcastService,
              private cd: ChangeDetectorRef,
              private toastrService: ToastrService,
              private customerService: CustomerService) {
    this.eventBroadcastService.broadcast(BroadcastEvents.TITLE, 'Customer Billing Rates');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadAllCustomerBillingRates();
    this.getCustomers();
  }

  toggleRow(element: any) {
    element.cbr && (element.cbr) ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
  }

  loadAllCustomerBillingRates() {
    this.isLoading = true;
    if (this.sort !== 'project') {
      this.selectedCustomerId = null;
    }
    this.cbrService.getAllCustomerBillingRates(this.sort, this.selectedCustomerId || null)
      .subscribe(response => {
        if (this.sort === 'project') {
          this.customerBillingRates = response.data[0].project;
        } else {
          this.customerBillingRates = response.data;
        }
        this.isLoading = false;
      });
  }

  openNewFormDialog() {
    const dialogRef = this.dialog.open(CustomerBillingRatesDialogComponent, {
      closeOnNavigation: true,
      disableClose: true,
      data: {
        new: true,
        customerId: this.selectedCustomerId || null,
        projectId: null,
        slaId: null,
        customerList: this.customerList,
        sort: this.sort,
        slaCodeList: this.slaCodesList,
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.refresh();
      this.loadAllCustomerBillingRates();
      this.isLoading = false;
    });
  }

  openFormDialog(cbrRow: ICustomerBillingRate) {
    const dialogRef = this.dialog.open(CustomerBillingRatesDialogComponent, {
      closeOnNavigation: true,
      disableClose: true,
      data: {
        sort: this.sort,
        new: false,
        id: cbrRow.id,
        customerId: cbrRow.customerId || null,
        projectId: cbrRow.projectId || null,
        slaId: cbrRow.slaId || null,
        fixedHourlyRate: cbrRow.fixedHourlyRate,
        fixedHours: cbrRow.fixedHours,
        additionalHourlyRate: cbrRow.additionalHourlyRate,
        additionalHours: cbrRow.additionalHours,
        customerName: cbrRow.customerName,
        slaName: cbrRow.slaName,
        projectName: cbrRow.projectName,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refresh();
      this.loadAllCustomerBillingRates();
      this.isLoading = false;
    });

  }

  getCustomers() {
    this.customerService.getAllCustomers().subscribe(response => {
      this.customerList = response.data;
    });
  }

  refresh() {
    this.cd.detectChanges();
  }

  onChange(event) {
    this.customerBillingRates = null;
  if (this.sort === 'customer') {
    this.selectedCustomerId = null;
    this.cbrService.getAllCustomerBillingRates('customer', null).subscribe(rtrn => {
      this.customerBillingRates = rtrn.data;
    });
  }
  if (this.sort === 'project' && this.selectedCustomerId) {
      this.cbrService.getAllCustomerBillingRates('project', this.selectedCustomerId).pipe(take(1)).subscribe(rtrn => {
        try {
          this.customerBillingRates = rtrn.data[0].project;
        } catch (e) {
          this.toastrService.error('this customer has no active customer billing rates');
        }
        });
  }
    if (this.sort === 'global') {
      this.selectedCustomerId = null;
      this.cbrService.getAllCustomerBillingRates('global', null).pipe(take(1)).subscribe(rtrn => {
        this.customerBillingRates = rtrn.data;
      });
    }
  }
}
