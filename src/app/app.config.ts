import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"danotes-3a6aa","appId":"1:393460319498:web:c75c0007ba8819243566f3","storageBucket":"danotes-3a6aa.firebasestorage.app","apiKey":"AIzaSyDCCfE10c83cyXuoRZ1cqDMqvU-B9ea01A","authDomain":"danotes-3a6aa.firebaseapp.com","messagingSenderId":"393460319498"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
};
