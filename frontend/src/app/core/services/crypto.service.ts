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

  fileToBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsDataURL(file);
    });
  }

  base64ToFile(base64: string, fileName: string): File {
    const [metadata, data] = base64.split(',');
    const mimeType =
      metadata.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File(
      [byteArray],
      fileName,
      { type: mimeType }
    );
  }

}