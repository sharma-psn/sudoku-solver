import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from '../../core/services/crypto.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  playGame() {
    this.router.navigate(['/play']);
  }

  solvePuzzle() {
    this.router.navigate(['/selection'], {fragment: this.cryptoService.encrypt({gameType: 'solve'})});
  }
}