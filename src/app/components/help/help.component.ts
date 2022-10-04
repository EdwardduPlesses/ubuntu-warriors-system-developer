import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SalesHelpComponent } from './sales-help/sales-help.component';
import { CustomersHelpComponent } from './customers-help/customers-help.component';
import { CustomerordersHelpComponent } from './customerorders-help/customerorders-help.component';
import { InventoryHelpComponent } from './inventory-help/inventory-help.component';
import { ProductsHelpComponent } from './products-help/products-help.component';
import { RepairsHelpComponent } from './repairs-help/repairs-help.component';
import { SuppliersHelpComponent } from './suppliers-help/suppliers-help.component';
import { SupplierodersHelpComponent } from './supplieroders-help/supplieroders-help.component';
import { UsersHelpComponent } from './users-help/users-help.component';
import { MatTableDataSource } from '@angular/material/table';
export interface HelpData {
  component: string;
  description: string;
}

const help_data: HelpData[] = [
{component: "Sales", description: "Sales component is where you can view all the sales that have been made. You can also add new sales, edit existing sales and delete sales."},
{component: "Customers", description: "Customers component is where you can view all the customers that have been made. You can also add new customers, edit existing customers and delete customers."},
{component: "Customer Orders", description: "Customer Orders is where you can view all the customer orders that have been made. You can also add new customer orders, edit existing customer orders and delete customer orders."},
{component: "Inventory", description: "Inventory helps you to view all the inventory items that are in stock. You can also add new inventory items, edit existing inventory items and delete inventory items."},
{component: "Products", description: "Products component is where you can view all the products that have been made. You can also add new products, edit existing products and delete products."},
{component: "Repairs", description: "Repairs component is where you can view all the repairs that have been made. You can also add new repairs, edit existing repairs and delete repairs."},
{component: "Suppliers", description: "Suppliers component is where you can view all the suppliers that have been made. You can also add new suppliers, edit existing suppliers and delete suppliers."},
{component: "Supplier Orders", description: "Supplier Orders component is where you can view all the supplier orders that have been made. You can also add new supplier orders, edit existing supplier orders and delete supplier orders."},
{component: "Users", description: "Users component is where you can view all the users that have been made. You can also add new users, edit existing users and delete users."},
];

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  displayedColumns: string[] = ['component', 'helpDescription'];
  dataSource = new MatTableDataSource(help_data);
  constructor(public authService: AuthService, public dialog: MatDialog) {
   }



  ngOnInit(): void {
  }

  rowClicked(row: any): void {
    if(row.component == "Sales"){
      this.dialog.open(SalesHelpComponent, {disableClose: true});
    }
    if(row.component == "Customers"){
      this.dialog.open(CustomersHelpComponent, {disableClose: true});
    }
    if(row.component == "Customer Orders"){
      this.dialog.open(CustomerordersHelpComponent, {disableClose: true});
    }
    if(row.component == "Inventory"){
      this.dialog.open(InventoryHelpComponent, {disableClose: true});
    }
    if(row.component == "Products"){
      this.dialog.open(ProductsHelpComponent, {disableClose: true});
    }
    if(row.component == "Repairs"){
      this.dialog.open(RepairsHelpComponent, {disableClose: true});
    }
    if(row.component == "Suppliers"){
      this.dialog.open(SuppliersHelpComponent, {disableClose: true});
    }
    if(row.component == "Supplier Orders"){
      this.dialog.open(SupplierodersHelpComponent, {disableClose: true});
    }
    if(row.component == "Users"){
      this.dialog.open(UsersHelpComponent, {disableClose: true});
    }

  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
