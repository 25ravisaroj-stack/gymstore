import { Injectable, Service, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    visible = signal(false);
    message = signal('');
    toastfailed = signal(false);

    show(message: string, messageType: string) {
        switch (messageType.toUpperCase()) {
            case "S":
                this.message.set(message);
                this.visible.set(true);
                setTimeout(() => {
                    this.visible.set(false);
                }, 3000);
                break;
            case "E":
                this.message.set(message);
                this.toastfailed.set(true);
                setTimeout(() => {
                    this.toastfailed.set(false);
                }, 3000);
                break;

        }

    }
}