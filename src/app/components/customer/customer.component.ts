import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from 'src/app/interface/customer-interface';
import { CustomerService } from 'src/app/services/customer.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CustomersHelpComponent } from '../help/customers-help/customers-help.component';
import { AddCustomerDialogComponent } from './add-customer-dialog/add-customer-dialog.component';
import { DeleteCustomerDialogComponent } from './delete-customer-dialog/delete-customer-dialog.component';
import { EditCustomerDialogComponent } from './edit-customer-dialog/edit-customer-dialog.component';
import { ViewCustomerDialogComponent } from './view-customer-dialog/view-customer-dialog.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})

export class CustomerComponent implements OnInit {
  customers: any = [];
  customerCompetencies: any = [];
  customerData: any = [];
  displayedColumns: string[] = ['titleDescr', 'CustomerName', 'CustomerSurname', 'streetName', 'customerCompetencyType', 'CustomerPhoneNo', 'CustomerIdNumber','CustomerEmail','actions',
  ];

  dataSource = new MatTableDataSource<Customer>();
  actionsClicked: boolean = false;
  isLoadingResults: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, public http: HttpClient, public snackbar: SnackbarService, public service: CustomerService) { }

  ngOnInit() {
    this.refresh()
  }

  ngAfterViewInit() {
    //To make the paginator work, uncomment the code
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addNewCustomer() {
    this.dialog
      .open(AddCustomerDialogComponent, { disableClose: true })
      .afterClosed()
      .subscribe(async () => await this.refresh());
      
  }

  editCustomer(customer: any) {
    this.service.CustomerData(customer);
    this.dialog
      .open(EditCustomerDialogComponent, { disableClose: true })
      .afterClosed()
      .subscribe(async () => await this.refresh())
  }

  viewCustomer(customer: any) {
    if (this.actionsClicked == false) {
      this.service.CustomerData(customer);
      this.dialog
        .open(ViewCustomerDialogComponent, { disableClose: true })
        .afterClosed();
    }
    this.actionsClicked = false;
  }

  deleteCustomer(customer: any) {
    this.service.CustomerData(customer);
    this.dialog
      .open(DeleteCustomerDialogComponent, { disableClose: true })
      .afterClosed()
      .subscribe(async () => await this.refresh());
  }

  async refresh() {
    this.isLoadingResults = true;
    //Get Customers
    await this.service.GetCustomers()
    .then(
      async (res) => {
        console.log(res)
        let Customer: Customer[] = []
        await res.forEach((customer: any) => {
           Customer.push({
            TitleId: customer.title.titleId,
            titleDescr: customer.title.titleDescr,
            CustomerId: customer.customerId,
            CustomerName: customer.customerName,
            CustomerSurname: customer.customerSurname,
            CustomerPhoneNo: customer.customerPhoneNo,
            CustomerIdNumber: customer.customerIdnumber,
            CustomerCompetencyId: customer.customerCompetency.customerCompetencyId,
            customerCompetencyType: customer.customerCompetency.customerCompetencyType,
            AddressId: customer.address.addressId,
            streetName: customer.address.streetName,
            streetNumber: customer.address.streetNumber,
            CustomerEmail: customer.customerEmail
          })
        })
      
        this.dataSource.data = [];
        this.dataSource.data =  Customer;
      },
      (response: HttpErrorResponse) => {
        if (response.status == 500) {
          this.snackbar.setMessage('error getting customers');
        }
      }
    ).finally(() => {
      this.isLoadingResults = false;
    });
  }

  onActionsClick() {
    this.actionsClicked = true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  openCustomersHelp()
  {
    this.dialog.open(CustomersHelpComponent, {disableClose: true})
  }


}
