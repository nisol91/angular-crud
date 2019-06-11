import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device } from './model/device';
// ho importato il modello Device

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
  active: Device;

  constructor(private http: HttpClient) {
    this.getAll();
  }



  getAll() {
    this.http.get<Device[]>('http://localhost:3000/devices')
      .subscribe(result =>
        //  console.log(result)
         this.devices = result
      );
  }

  //metodo per evidenziare l elemento selezionato, se attivo.
  setActive(device: Device) {
    this.active = device;
  }

  //metodo delete, invocato al click del mouse (vedi app.component.html)
  delete(event: MouseEvent, device: Device) {
    event.stopPropagation()
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
