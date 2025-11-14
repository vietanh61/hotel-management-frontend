import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import 'devextreme-angular';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
