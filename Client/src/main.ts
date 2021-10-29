import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

Sentry.init({
  dsn: "https://c7e8b6da9cd14629a228cfd8f34836d9@o921308.ingest.sentry.io/5867671" ,
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
