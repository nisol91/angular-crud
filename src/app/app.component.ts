import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device } from './model/device';
// ho importato il modello Device
import { NgForm } from '@angular/forms';

const INITIAL_STATE = { label: null, os: null };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //qui dichiaro le variabili (proprieta') con il loro tipo
  title = 'crud-ang';

  devices: Device[];
  //la variabile devices e' di tipo Device[] quindi array. questo per evitare errori

  active: Device = INITIAL_STATE;
  // active: Device = {};
  //ho istanziato anche la proprieta active che e un oggetto, o direttamente {}, oppure definisco una costante come ho fatto, che pero rimane sempre un oggetto con dei valori


  constructor(private http: HttpClient) {
    this.getAll();
  }

  //metodo per evidenziare l elemento selezionato, se attivo.
  setActive(device: Device) {
    console.log(device)
    this.active = device;
  }

  reset() {
    this.active = INITIAL_STATE;
  }


  getAll() {
    this.http.get<Device[]>('http://localhost:3000/devices')
      .subscribe(result =>
        //  console.log(result)
         this.devices = result
      );
  }

// sezione dedicata ai metodi add e edit. add e' molto simile a getAll, mentre edit e' abbastanza complesso e intricato.
  add(device: Device) {
    this.http.post<Device>(`http://localhost:3000/devices`, device)
      .subscribe(res => {
        this.devices.push(res)
        this.reset();
      })
  }

  edit(device: Device) {
    const newDevice = Object.assign(
      {},
      this.active,
      device
    );

    this.http.patch<Device>(`http://localhost:3000/devices/${newDevice.id}`, newDevice)
      .subscribe(
        res => {
          const index = this.devices.findIndex(device => device.id === newDevice.id);
          this.devices[index] = newDevice;
        }
      );

  }
// -----

  //l if mi setta la differenza fra edit e add, in base al fatto che ci sia active
  save(form: NgForm) {
    if (this.active.id) {
      this.edit(form.value);
    } else {
      this.add(form.value);
      form.reset();
    }
  }


  //metodo delete, invocato al click del mouse (vedi app.component.html)
  delete(event: MouseEvent, device: Device) {
    event.stopPropagation()
    //stop propagation serve per far si che solo questo evento e non altri tipo setActive vengano invocati al click dell icona
    this.http.delete<any>(`http://localhost:3000/devices/${device.id}`)
      .subscribe(
        () => {
          const index = this.devices.indexOf(device)
          this.devices.splice(index, 1);
        }
      );
  }

}

// 1. importo il componente http che mi serve per le chiamate al server
// 2. istanzio il componente nel costruttore e subito chiamo il metodo getAll (this vuole dire che e riferito a questo oggetto AppComponent)
// 3. utilizzo il componente per fare una chiamata al server che mi fa consolelog dei risultati della chiamata oppure mi stampa i risultati nella variabile devices
//    che e' di tipo Device[] e glielo indico nel metodo della chiamata con le < >
