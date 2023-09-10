import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

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
  flipped = false;
  footer = false;
  loading = false;
  hastaCompletado = 0;

  HastaCompletado() {
    let hastaCompletado = 0;
    if (this.pedidoForm.invalid && this.hastaCompletado >= 1) {
      hastaCompletado = 1;
    }
    else if (this.localForm.invalid && this.hastaCompletado >= 2) {
      hastaCompletado = 2;
    }
    else if (this.lugarEntregaForm.invalid && this.hastaCompletado >= 3) {
      hastaCompletado = 3;
    } else if ((this.metodoPago == "Tarjeta" && this.tarjetaForm.invalid || this.metodoPago == "Efectivo" && this.efectivoForm.invalid) && this.hastaCompletado >= 5) {
      hastaCompletado = 5;
    }
    else if ((this.metodoPago == "Tarjeta" && this.tarjetaForm.invalid || this.metodoPago == "Efectivo" && this.efectivoForm.invalid) && this.hastaCompletado >= 4) {
      hastaCompletado = 4;
    }
    else if (this.hastaCompletado > this.vistaActual) {
      hastaCompletado = this.hastaCompletado;
    }
    else {
      hastaCompletado = this.vistaActual;
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
    referencia: new FormControl('', [Validators.maxLength(120)])
  });
  lugarEntregaForm = new FormGroup({
    calle: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
    ciudad: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    referencia: new FormControl('', [Validators.maxLength(120)]),
    entrega: new FormControl('lo-antes-posible', [Validators.maxLength(120)]),
    fecha: new FormControl(this.ConseguirFechaActual(), []),
    hora: new FormControl('', [])
  });
  tarjetaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16,16}'), this.isVisa()]),
    vencimiento: new FormControl("", [Validators.required, Validators.maxLength(120)]),
    codigo: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3,3}')]),
  });

  efectivoForm = new FormGroup({
    monto: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
  });
  ConseguirFechaActual() {
    var fecha = new Date();
    var dia = fecha.getDate();
    let diaString = dia.toString();
    var mes = fecha.getMonth() + 1;
    let mesString = mes.toString();
    var anio = fecha.getFullYear();
    if (dia < 10) {
      diaString = "0" + diaString;

    }
    if (mes < 10) {
      mesString = "0" + mesString;
    }
    let fe = anio + "-" + mesString + "-" + diaString;
    return fe;
  }
  CambiarVista(vista: number) {
    this.salidaIzquierda = true;
    this.submited = false;
    if (vista > this.hastaCompletado) {
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
    return form.controls[control].invalid && (form.controls[control].dirty || form.controls[control].touched || this.submited);
  }

  Error(form: FormGroup, control: string, error: string) {
    return this.TieneErrores(form, control) && form.controls[control].hasError(error)
  }
  QuitarRequired() {
    this.lugarEntregaForm.controls["fecha"].clearValidators();
    this.lugarEntregaForm.controls["fecha"].updateValueAndValidity();
    this.lugarEntregaForm.controls["hora"].clearValidators();
    this.lugarEntregaForm.controls["hora"].updateValueAndValidity();

  }
  AgregarRequired() {
    this.lugarEntregaForm.controls["fecha"].setValidators([Validators.required]);
    this.lugarEntregaForm.controls["fecha"].updateValueAndValidity();
    this.lugarEntregaForm.controls["hora"].setValidators([Validators.required]);
    this.lugarEntregaForm.controls["hora"].updateValueAndValidity();
  }
  NumeroTarjeta(numeroIngresado: string) {
    let numero: string = "";
    for (let i = 0; i < 16; i++) {
      if (i % 4 == 0 && i !== 0) {
        numero += "  ";
      }
      if (numeroIngresado.toString().length > i) {
        numero += numeroIngresado.toString()[i].toString();
      }
      else {
        numero += "X";
      }

    }
    return numero;
  }

  Vencimiento() {
    let vencimiento = this.tarjetaForm.controls["vencimiento"].value;
    let mes = vencimiento!.substring(0, 2);
    let anio = vencimiento!.substring(2, 4);
    return mes + "/" + anio;
  }

  Visa() {
    return this.tarjetaForm.controls["numero"].value!.toString()[0] == "4";
  }
  MasterCard() {
    return this.tarjetaForm.controls["numero"].value!.toString()[0] == "5";
  }

  isVisa(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.isVisaCard(control.value.toString()) ? null : { isvisa: { value: control.value } };
    };
  }

  isVisaCard(cardNumber: string): boolean {
    if (cardNumber) {
      // que empieze con 4
      if (cardNumber.length == 0) {
        return false;
      }

      if (cardNumber[0] !== '4') {
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  MesyAnioActual() {
    let fecha = new Date();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear().toString();
    let mesString = mes.toString();
    if (mes < 10) {
      mesString = "0" + mesString;
    }
    return anio + "-" + mesString;
  }
  confirmado = false;
  Confirmar() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.confirmado = true;
    }, 3500);

  }

  Resetear(){
    this.pedidoForm = new FormGroup({
      objetos: new FormControl('', [Validators.required, Validators.maxLength(1200)]),
      imagen: new FormControl('')
    });
    this.localForm = new FormGroup({
      calle: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
      ciudad: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      referencia: new FormControl('', [Validators.maxLength(120)])
    });
    this.lugarEntregaForm = new FormGroup({
      calle: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
      ciudad: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      referencia: new FormControl('', [Validators.maxLength(120)]),
      entrega: new FormControl('lo-antes-posible', [Validators.maxLength(120)]),
      fecha: new FormControl(this.ConseguirFechaActual(), []),
      hora: new FormControl('', [])
    });
    this.tarjetaForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16,16}'), this.isVisa()]),
      vencimiento: new FormControl("", [Validators.required, Validators.maxLength(120)]),
      codigo: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3,3}')]),
    });
  
    this.efectivoForm = new FormGroup({
      monto: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
    });
  }
  Terminar( e: boolean) {
    
    //drop every change on the forms
    this.vistaActual = 0;
    this.hastaCompletado = 0;
    this.metodoPago = "Efectivo";
    this.submited = false;
    this.imagenSubida = "";
    this.Resetear();
    this.loading = false;
    this.confirmado = false;
    
  }
}
