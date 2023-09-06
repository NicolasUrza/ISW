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
  footer=false;
  hastaCompletado=0;

  HastaCompletado(){
    let hastaCompletado = 0;
    if(this.pedidoForm.invalid && this.hastaCompletado>= 1){
      hastaCompletado=1;
    }
    else if(this.localForm.invalid && this.hastaCompletado>= 2){
      hastaCompletado=2;
    }
    else if(this.lugarEntregaForm.invalid && this.hastaCompletado>= 3){
      hastaCompletado=3;
    }else if((this.metodoPago=="Tarjeta" && this.tarjetaForm.invalid || this.metodoPago=="Efectivo" && this.efectivoForm.invalid) && this.hastaCompletado>= 5){
      hastaCompletado=5;
    }
    else if((this.metodoPago=="Tarjeta" && this.tarjetaForm.invalid || this.metodoPago=="Efectivo" && this.efectivoForm.invalid) && this.hastaCompletado>= 4){
      hastaCompletado=4;
    }
    else if(this.hastaCompletado> this.vistaActual){
      hastaCompletado=this.hastaCompletado;
    }
    else{
      hastaCompletado=this.vistaActual;
    }
    return hastaCompletado;
  }
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
    nombre: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16,16}')]),
    vencimiento: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    codigo: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3,3}')]),
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
    if(vista> this.hastaCompletado){
      this.hastaCompletado = vista;
    }
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
  EliminarImagen() {
    this.imagenSubida = '';
    this.pedidoForm.controls["imagen"].setValue('');
  }
  TotalPago() {
    return 1000;
  }
  MetodoDePago(metodo: string) {
    this.metodoPago = metodo;
    this.CambiarVista(5);
  }
  TieneErrores(form: FormGroup, control: string) {
    console.log(control)
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
  NumeroTarjeta(numeroIngresado:string){
    let numero:string = "";
    for(let i= 0 ; i<16; i++ ){
      if(i%4==0 && i !== 0){
        numero += "  ";
      }
      if(numeroIngresado.toString().length>i){
        numero += numeroIngresado.toString()[i].toString();
      }
      else{
        numero += "X";
      }
      
    }
    return numero;
  }

  Vencimiento(){
    let vencimiento = this.tarjetaForm.controls["vencimiento"].value;
    let mes = vencimiento!.substring(0,2);
    let anio = vencimiento!.substring(2,4);
    return mes+"/"+anio;
  }
}
