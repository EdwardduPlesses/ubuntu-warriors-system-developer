import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UpdatePermissionsComponent } from './permissions/update-permissions/update-permissions.component';
import { ViewPermissionsComponent } from './permissions/view-permissions/view-permissions.component';
import { AddVatComponent } from './vat/add-vat/add-vat.component';
import { ViewVatComponent } from './vat/view-vat/view-vat.component';
import { ViewInventoryStatusComponent } from './statuses/view-inventory-status/view-inventory-status.component';
import { ViewProductStatusComponent } from './statuses/view-product-status/view-product-status.component';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'VAT',
    children: [{ name: 'View VAT Rate' }, { name: 'Update VAT Rate' }],
  },
  {
    name: 'Inventory Statuses',
    children: [{ name: 'Update Inventory Statuses' }],
  },
  {
    name: 'Product Statuses',
    children: [{ name: 'Update Product Statuses' }],
  },
  {
    name: 'Permissions',
    children: [
      { name: 'View Permissions' },
      { name: 'Update Permissions' },
    ]
  },
  {
    name: 'Users',
    children: [{ name: 'User Types' }, { name: 'View Users' }],
  },
  {
    name: 'Product Types',
    children: [{ name: 'Product Types' }],
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(public authService: AuthService, public dialog: MatDialog, public router: Router) { this.dataSource.data = TREE_DATA; }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.authService.getPermissions();
  }

  async vatClicked(node: any) {
    if (node == 'View VAT Rate') {
      //open view vat dialog
      this.dialog.open(ViewVatComponent, { disableClose: true })
    }
    if (node == 'Update VAT Rate') {
      //open add vat dialog
      this.dialog.open(AddVatComponent, { disableClose: true })
    }
    if (node == 'Update Inventory Statuses') {
      //open add vat dialog
      this.dialog.open(ViewInventoryStatusComponent, { disableClose: true })
    }
    if (node == 'Update Product Statuses') {
      //open add vat dialog
      this.dialog.open(ViewProductStatusComponent, { disableClose: true })
    }
      if (node == 'View Permissions') {
        this.dialog.open(ViewPermissionsComponent, { disableClose: true })
      }
      if (node == 'Update Permissions') {
        this.dialog.open(UpdatePermissionsComponent, { disableClose: true })
      }
      if (node == 'User Types') {
        this.router.navigate(['/user-type']);
      }
      if (node == 'View Users') {
        this.router.navigate(['/users']);
      }
      if (node == 'Product Types') {
        this.router.navigate(['/product-type']);
      }
  }
}