import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlayComponent } from './pages/play/play.component';
import { SolveComponent } from './pages/solve/solve.component';
import { SelectionComponent } from './pages/selection/selection.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'selection',
    component: SelectionComponent
  },
  {
    path: 'play',
    component: PlayComponent
  },
  {
    path: 'solve',
    component: SolveComponent
  }
];