import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, NgClass, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  isOpen = false;
  logo="assets/images/orion_option1_fixed.svg";

  openMenu() {
    this.isOpen = true;
  }

  closeMenu() {
    this.isOpen = false;
  }
}
