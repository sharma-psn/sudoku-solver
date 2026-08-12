import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlayComponent } from './pages/play/play.component';
import { SolveComponent } from './pages/solve/solve.component';
import { SelectionComponent } from './pages/selection/selection.component';
import { ReviewComponent } from './pages/review/review.component';
import { UploadImageComponent } from './pages/upload-image/upload-image.component';

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
  },
  {
    path: 'upload',
    component: UploadImageComponent
  },
  {
    path: 'review',
    component: ReviewComponent
  }
];