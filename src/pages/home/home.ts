import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

const LIGHTBULB_SERVICE = 'ff10';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  devices: any[] = [];
  statusMessage: string;
  constructor(
    public navCtrl: NavController,
    private ngZone: NgZone,
    public toastCtrl: ToastController,
    private ble: BLE
  ) {}
  ngOnInit() {
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];
    this.ble
      .scan([], 10)
      .subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.onError(error, 'Error scanning for Bluetooth low energy devices')
      );

    setTimeout(this.setStatus.bind(this), 10000, 'Scan complete!');
  }

  onDeviceDiscovered(device) {
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  setStatus(message) {
    this.statusMessage = message;
  }

  onError(error, message) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message,
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  onDeviceSelected(device) {
    console.log('A device is seleted.');
  }
}
