import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit {

  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void { }

  back() {
    this.authService.aboutPageObs.next(false);
    this.router.navigate(["/"]);
  }
}