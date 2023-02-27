import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Route } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { CardComponent } from './pages/card/card.component';
import { ListComponent } from './pages/card/list/list.component';
import { HomeComponent } from './pages/home/home.component';
import { DeskService } from './services/desk.service';
import { PokemonService } from './services/pokemon.service';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent, title: 'home' },
  { path: 'about', component: AboutComponent, title: 'about' },
  {
    path: 'cards',
    component: CardComponent,
    title: 'cards',
    children: [{ path: '', component: ListComponent }],
    // providers: [DeskService, PokemonService],
  },
  // {
  //   path: 'category',
  //   loadChildren: () =>
  //     import('./category/category.routes').then((m) => m.routes),
  // },
];
