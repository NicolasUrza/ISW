import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MapGeocoder } from '@angular/google-maps';
import { MapDirectionsService } from '@angular/google-maps';
@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss']
})
export class GmapComponent implements OnChanges {
  @Input() ciudad: string = 'Villa Carlos Paz';
  @Input() calle: string = '';
  @Input() numero: string = '';
  @Input() desde: google.maps.LatLngLiteral | undefined;
  @Output() adress_component = new EventEmitter<google.maps.GeocoderAddressComponent[]>();
  @Output() ruta = new EventEmitter<number>();
  @Output() coordenadas = new EventEmitter<google.maps.LatLngLiteral>();
  @Output() existe = new EventEmitter<boolean>();
  apiLoaded: Observable<boolean>;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPosition: google.maps.LatLngLiteral | undefined;
  zoom = 16;
  geocoder: MapGeocoder;
  center: google.maps.LatLngLiteral = { lat: -31.4252716, lng: -64.4972074 };
  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPosition = event.latLng!.toJSON();

    this.coordenadas.emit(this.markerPosition);
    this.center = event.latLng!.toJSON();
    this.MostrarCalle(event.latLng!.toJSON());
  }
  mapDirectionsService: MapDirectionsService;
  constructor(httpClient: HttpClient, geocoder: MapGeocoder, mapDirectionsService: MapDirectionsService) {
    this.mapDirectionsService = mapDirectionsService;
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyBO9tpv7yPFi5gqEET3PG6tXBQf0VOfjdo', 'callback').pipe(
      map(() => true),
      catchError(() => of(false)),
    );
    this.geocoder = geocoder;
  }
  ObtenerCoordenadas(): google.maps.LatLngLiteral {
    this.geocoder.geocode({
      address: this.numero + " " + this.calle + " , " + this.ciudad + ' , AR'
    }).subscribe(({ results }) => {
      this.markerPosition = results[0].geometry.location.toJSON();
    });
    return this.markerPosition!;

  }
  MostrarCalle(latLng: google.maps.LatLngLiteral) {

    this.geocoder.geocode({
      location: latLng
    }).subscribe(({ results }) => {
      console.log(results[0].address_components);
      this.adress_component.emit(results[0].address_components);
      console.log("estoy en mostrar calle")
      if (this.desde) {
        console.log("estoy en mostrar calle y en desde")
        this.CalcularValor();
      }
    }
    );
  }

  CalcularValor() {
    console.log("estoy en calcular valor")
    console.log(this.desde);
    console.log(this.markerPosition);
    let request = {
      destination: this.desde!,
      origin: this.markerPosition!,
      travelMode: google.maps.TravelMode.DRIVING
    };
    console.log(request);
    this.mapDirectionsService.route(request).subscribe((results) => {
      console.log("estoy en la query");
      console.log(results);

      this.ruta.emit(results.result?.routes[0]?.legs[0]?.distance?.value);
    }
    );
    // .pipe((response) =>
    //   this.ruta.emit( response.result?.routes[0]?.legs[0]?.distance?.value));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['ciudad'] || changes['calle'] || changes['numero']) {
      this.geocoder.geocode({
        address: this.numero + " " + this.calle + " , " + this.ciudad + ' , AR'
      }).subscribe(({ results }) => {
        console.log(results);
        this.ValidarExistencia(results);
        this.markerPosition = results[0].geometry.location.toJSON();
        this.coordenadas.emit(this.markerPosition);
        if (this.desde) {
          this.CalcularValor();
        }
        this.center = results[0].geometry.location.toJSON();
      })

        ;
    }
  }

  ValidarExistencia(results: google.maps.GeocoderResult[]) {
    let calleExiste = false;
    let numeroExiste = false;
    if (results.length == 0) {
      console.log("no existe")
      this.existe.emit(false);
    }
    else {
      results[0].address_components.forEach(element => {
        console.log("estoy en el foreach");
        console.log(element);
        if (element.types.includes("street_number")) {
          console.log("numero existe");
          numeroExiste = true;
        }
        if (element.types.includes("route")) {
          console.log("calle existe");
          calleExiste = true;
        }
      });
    }
    if (calleExiste && numeroExiste) {
      console.log("existe");
      this.existe.emit(true);
    } else {
      console.log("no existe")
      this.existe.emit(false);
    }
  }
}
