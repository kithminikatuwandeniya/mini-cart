import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule, routerComponents } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { JwtModule } from '@auth0/angular-jwt';
import { GlobalErrorHandler } from './errors/global-error-handler';
import { environment } from '../environments/environment';
import { ToastsContainerComponent } from "./websocket/notification/toasts-container.component";
import { TruncatePipe } from './pipe/truncate.pipe';
import { NgbdSortableHeader } from "./associate/ngbd-sortable-header.directive";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ItemListComponent } from './item/item-list/item-list.component';
import { ViewUsersComponent } from './users/view-users/view-users.component';
import { UpdateUsersComponent } from './users/update-users/update-users.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { DatePipe } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { CartComponent } from './cart/cart.component';
import { AddUsersComponent } from './users/add-users/add-users.component';
import { CreateBillComponent } from './billings/create-bill/create-bill.component';
import { NgxCaptureModule } from 'ngx-capture';

export function getToken() {
  let jwtToken = '';
  if (sessionStorage.getItem('jwt-token')) {
    jwtToken = sessionStorage.getItem('jwt-token');
  }
  return jwtToken;
}

@NgModule({
  declarations: [
    AppComponent,
    ToastsContainerComponent,
    routerComponents,
    TruncatePipe,
    NgbdSortableHeader,
    ItemListComponent,
    ViewUsersComponent,
    UpdateUsersComponent,
    AddUsersComponent,
    CreateBillComponent,
    DashboardViewComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: [''],
        skipWhenExpired: true
      }
    }),
    FontAwesomeModule,
    ChartsModule,
    NgxCaptureModule
  ],
  providers: [
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
