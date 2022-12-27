import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { Mqtt } from './mqtt.service';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { FloorSelectorComponent } from './floor-selector/floor-selector.component';
import { GatewaySelectorComponent } from './gateway-selector/gateway-selector.component';
import { DevicePageComponent } from './device-page/device-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPageComponent } from './confirm-page/confirm-page.component';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { SetLampsComponent } from './set-lamps/set-lamps.component';
import { DialogPopupComponent } from './gateway-selector/dialog-popup/dialog-popup.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopuperrorComponent } from './set-lamps/popuperror/popuperror.component';
import { MQTT_SERVICE_OPTIONS } from './environments/environment';
import { LightShowComponent } from './light-show/light-show.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
@NgModule({
  declarations: [
    AppComponent,
    FloorSelectorComponent,
    GatewaySelectorComponent,
    DevicePageComponent,
    ConfirmPageComponent,
    LoadingPageComponent,
    SetLampsComponent,
    DialogPopupComponent,
    PopuperrorComponent,
    LightShowComponent,
  ],
  imports: [
    MatPaginatorModule,
    BrowserModule,
    OverlayModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatSortModule,
    RouterModule.forRoot([
      // {path: 'home-page', component: HomePageComponent},
      { path: '', component: FloorSelectorComponent },
      { path: 'device-page', component: DevicePageComponent },
      { path: 'floor-selector', component: FloorSelectorComponent },
      { path: 'gateway-selector', component: GatewaySelectorComponent },
      { path: 'device-page', component: DevicePageComponent },
      { path: 'confirm-page', component: ConfirmPageComponent },
      { path: 'loading-page', component: LoadingPageComponent },
      { path: 'set-lamps', component: SetLampsComponent },
      { path: 'light-show', component: LightShowComponent },
    ]),
    NgbModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ],
  providers: [Mqtt, MatDialog],
  bootstrap: [AppComponent],
})
export class AppModule {}
