import { Route } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { CardComponent } from './pages/card/card.component';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent, title: 'home' },
  { path: 'about', component: AboutComponent, title: 'about' },
  { path: 'cards', component: CardComponent, title: 'cards' },
];
