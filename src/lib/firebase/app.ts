import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from './config';

// Guards against re-initializing on HMR.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
