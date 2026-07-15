import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() {}

  encrypt(data: unknown): string {
    return btoa(JSON.stringify(data));
  }

  decrypt<T>(value: string): T {
    return JSON.parse(atob(value)) as T;
  }

}