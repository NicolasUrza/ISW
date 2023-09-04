import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FrontEnd';
  salidaIzquierda = false;
  salidaDerecha = false;
  entradaIzquierda = false;
  entradaDerecha = false;
  vistaActual = 0;
  metodoPago = "Efectivo";
  imagenSubida = "";
  submited = false;
  flipped=false;
  pedidoForm = new FormGroup({
    objetos: new FormControl('', [Validators.required, Validators.maxLength(1200)]),
    imagen: new FormControl('')
  });
  localForm = new FormGroup({
    calle: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
    ciudad: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    referencia: new FormControl('', [ Validators.maxLength(120)])
  });
  lugarEntregaForm = new FormGroup({
    calle: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
    ciudad: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    referencia: new FormControl('', [ Validators.maxLength(120)]),
    entrega: new FormControl('lo-antes-posible', [ Validators.maxLength(120)]),
    fecha: new FormControl('', []),
    hora: new FormControl('', [])
  });
  tarjetaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
    vencimiento: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    codigo: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
  });

  efectivoForm = new FormGroup({
    monto: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
  });
  ConseguirFechaActual() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    if (dia < 10) {
      dia = 0 + dia;
    }
    if (mes < 10) {
      mes = 0 + mes;
    }

    return dia + "/" + mes + "/" + anio;
  }
  CambiarVista(vista: number) {
    this.salidaIzquierda = true;
    this.submited = false;
    if (this.pedidoForm.controls["imagen"].value != '') {
      this.imagenSubida = this.pedidoForm.controls["imagen"].value!;
      this.pedidoForm.controls["imagen"].setValue('');
    }
    setTimeout(() => {
      this.salidaIzquierda = false;
      this.vistaActual = vista;
    }, 500);

  }
  ExisteImagen() {
    return this.pedidoForm.controls["imagen"].value != '' || this.imagenSubida != '';
  }
  constructor() { }

  TotalPago() {
    return 1000;
  }
  MetodoDePago(metodo: string) {
    this.metodoPago = metodo;
    this.CambiarVista(5);
  }
  TieneErrores(form: FormGroup, control: string) {
    return form.controls[control].invalid && (form.controls[control].dirty || form.controls[control].touched || this.submited);
  }

  Error(form: FormGroup, control: string, error: string) {
    return this.TieneErrores(form, control) && form.controls[control].hasError(error)
  }
  QuitarRequired(){
    this.lugarEntregaForm.controls["fecha"].clearValidators();
    this.lugarEntregaForm.controls["fecha"].updateValueAndValidity();
    this.lugarEntregaForm.controls["hora"].clearValidators();
    this.lugarEntregaForm.controls["hora"].updateValueAndValidity();

  }
  AgregarRequired(){
    this.lugarEntregaForm.controls["fecha"].setValidators([Validators.required]);
    this.lugarEntregaForm.controls["fecha"].updateValueAndValidity();
    this.lugarEntregaForm.controls["hora"].setValidators([Validators.required]);
    this.lugarEntregaForm.controls["hora"].updateValueAndValidity();
  }
}
