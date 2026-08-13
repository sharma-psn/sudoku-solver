import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthService } from './core/services/health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sudoku-frontend';
  constructor(
    private healthService: HealthService
  ) { }
  ngOnInit(): void {
    this.healthService.healthCheck().subscribe({
      next: (response) => {
        console.log('Health check response:', response);
      },
      error: (error) => {
        console.error('Health check error:', error);
      }
    });
  }
}