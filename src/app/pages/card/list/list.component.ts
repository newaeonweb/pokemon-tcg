import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Params, ActivatedRoute, Router } from '@angular/router';
import {
  Subscription,
  Observable,
  BehaviorSubject,
  debounceTime,
  switchMap,
  take,
  shareReplay,
  tap,
  forkJoin,
  distinctUntilChanged,
  of,
  map,
  catchError,
} from 'rxjs';
import { Card } from 'src/app/interfaces/card.interface';
import { DeskService } from 'src/app/services/desk.service';
import { PokemonService } from 'src/app/services/pokemon.service';
import { SelectedSearchPipeModule } from 'src/app/pipes/selected-search.pipe';
import { PokeCardComponent } from '../components/poke-card/poke-card.component';
import { PokeCardDetailComponent } from '../components/poke-card-detail/poke-card-detail.component';

@Component({
  selector: 'pokemon-tcg-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatDialogModule,
    SelectedSearchPipeModule,
    PokeCardComponent,
    PokeCardDetailComponent,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('drawer')
  drawer!: MatDrawer;
  @ViewChild('toTop')
  toTop!: ElementRef;
  subscription = new Subscription();

  characters$ = new Observable<Card[]>();
  searchTerm$ = new BehaviorSubject<any>('');
  resultsLength = 0;
  queryParams!: Params;
  formFilter!: FormGroup;
  searchListText = '';
  emptyResult = false;

  typesList!: string[];
  subtypesList!: string[];
  supertypesList!: string[];
  setList!: string[];

  activatedRoute!: ActivatedRoute;
  card!: Card;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private router: Router,
    private deskService: DeskService
  ) {
    this.characters$ = this.route.queryParams.pipe(
      debounceTime(300),
      switchMap((params) => {
        this.queryParams = {
          page: params['page'] || 1,
          pageSize: params['pageSize'] || 4,
          orderBy: params['orderBy'] || 'name',
          q: params['q'] || '',
        };

        if (params['q']) {
          const query = this.convertQueryStringToObject();

          this.formFilter.setValue({
            searchField: query['name'] || '',
            supertype: query['supertype'] || '',
            types: query['types'] || '',
            subtypes: query['subtypes'] || '',
            set: query['set.name'] || '',
          });
        }

        return this.getCards();
      }),
      take(1),
      shareReplay(1)
    );
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.queryParams['page'] = this.paginator.pageIndex + 1;
      this.queryParams['pageSize'] = this.paginator.pageSize;
      this.characters$ = this.getCards();
      this.updateUrlQueryParams();
      this.toTop.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    });
  }

  ngOnInit() {
    this.createForm();
    this.searchListening();
    this.subscription = this.loadFilters()
      .pipe(
        tap((result) => {
          this.typesList = result[0];
          this.subtypesList = result[1];
          this.supertypesList = result[2];
          this.setList = result[3];
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.formFilter = this.fb.group({
      searchField: [''],
      supertype: [''],
      types: [''],
      subtypes: [''],
      set: [''],
    });
  }

  convertQueryStringToObject() {
    const queryStringToObj = this.queryParams['q']
      .split(' ')
      .map((value: string) => value.split(':').map((text) => text.trim()))
      .reduce((obj: { [value: string]: any }, value: any[]) => {
        obj[value[0]] = value[1];
        return obj;
      }, {});
    // remove empty properties from object
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(queryStringToObj).filter(([_, value]) => value != null)
    );
  }

  updateUrlQueryParams() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.queryParams,
      queryParamsHandling: 'merge',
    });
  }

  loadFilters() {
    // Load all filter list from API as an Observable
    const typesList = this.pokemonService.getListFilters('types');
    const subtypesList = this.pokemonService.getListFilters('subtypes');
    const supertypesList = this.pokemonService.getListFilters('supertypes');
    const setList = this.pokemonService.getListFilters('sets');

    return forkJoin([typesList, subtypesList, supertypesList, setList]);
  }

  searchListening() {
    this.formFilter.valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap((filter) => {
          let query = '';

          if (filter.searchField) {
            query = query.concat('', `name:${filter.searchField}`);
          }

          if (filter.supertype) {
            query = query.concat(' ', `supertype:${filter.supertype}`);
          }

          if (filter.types) {
            query = query.concat(' ', `types:${filter.types}`);
          }

          if (filter.subtypes) {
            query = query.concat(' ', `subtypes:${filter.subtypes}`);
          }

          if (filter.set) {
            query = query.concat(' ', `set.name:${filter.set}`);
          }

          this.characters$ = of([]);

          this.queryParams['q'] = query;

          this.updateUrlQueryParams();

          return this.getCards();
        }),
        shareReplay(1)
      )
      .subscribe();
  }

  clearFilters() {
    this.formFilter.patchValue({
      searchField: '',
      supertype: '',
      types: '',
      subtypes: '',
      set: '',
    });
    this.emptyResult = false;
    this.queryParams['q'] = '';
    this.updateUrlQueryParams();
  }

  dispatchSearch(value: any) {
    this.queryParams['page'] = 1;
    this.queryParams['q'] = `name:${value}`;
    this.updateUrlQueryParams();
  }

  clearSearch() {
    this.formFilter.get(['searchField'])?.setValue('');
    this.queryParams['q'] = '';
    this.updateUrlQueryParams();
  }

  getCards(): Observable<any> {
    return this.pokemonService.getAll(this.queryParams).pipe(
      map((res: any) => {
        console.log(
          '🚀 ~ file: list.component.ts:267 ~ ListComponent ~ map ~ res:',
          res
        );
        if (res.data.length === 0) {
          this.emptyResult = true;
          this.characters$ = of([]);
          return;
        }
        this.emptyResult = false;
        this.resultsLength = res.totalCount;
        this.queryParams['pageSize'] = res.pageSize;
        this.characters$ = of(res.data);
      }),
      catchError(() => (this.characters$ = of([]))),
      shareReplay(1)
    );
  }

  showDetails(card: any) {
    this.card = card;
    this.drawer.open();
  }

  addToDesk(card: any) {
    this.deskService.addToCart(card);
  }
}
