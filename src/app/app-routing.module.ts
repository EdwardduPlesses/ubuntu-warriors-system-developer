import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SalesComponent } from './components/sales/sales.component';
import { RepairComponent } from './components/repair/repair.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { UsersComponent } from './components/users/users.component';
import { UserTypeComponent } from './components/configuration/user-type/user-type.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { CustomerordersComponent } from './components/customerorders/customerorders.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { CalenderComponent } from './components/repair/calender/calender.component';
import { SupplierOrdersComponent } from './components/supplier-orders/supplier-orders.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { HelpComponent } from './components/help/help.component';
import { CompletedRepairsComponent } from './components/completed-repairs/completed-repairs.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { AboutComponent } from './components/about/about.component';
import { ProductTypeComponent } from './components/configuration/product-type/product-type.component';
import { UserPermissionsComponent } from './components/user-permissions/user-permissions.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'users', component: UsersComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'user-type', component: UserTypeComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product-type', component: ProductTypeComponent },
  { path: 'repair', component: RepairComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'customer-orders', component: CustomerordersComponent },
  { path: 'supplier', component: SuppliersComponent },
  { path: 'calender', component: CalenderComponent },
  { path: 'supplier-orders', component: SupplierOrdersComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'help', component: HelpComponent },
  { path: 'completedRepairs', component: CompletedRepairsComponent },
  { path: 'user-permissions', component: UserPermissionsComponent },
  { path: 'audit-trail', component: AuditTrailComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }