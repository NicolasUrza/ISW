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
  fileSelected = "Puedes incluir una imagen si quieres para que te ayudemos a encontrarlo más rápido";
  pedidoForm = new FormGroup({
    objetos: new FormControl('', [Validators.required, Validators.maxLength(1200)]),
    imagen: new FormControl(null)
  });
  localForm = new FormGroup({
    calle: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    numero: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,7}')]),
    ciudad: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    referencia: new FormControl('', [Validators.required, Validators.maxLength(120)])
  });



  CambiarVista(vista: number) {
    this.salidaIzquierda = true;
    setTimeout(() => {
      this.salidaIzquierda = false;
      this.vistaActual = vista;
    }, 500);
  }
  ExisteImagen() {
    console.log(this.pedidoForm.controls["imagen"].value);
    return this.pedidoForm.controls["imagen"].value != null;
  }
  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const inputs = this.el.nativeElement.querySelectorAll('.inputfile');
    Array.prototype.forEach.call(inputs, (input: HTMLInputElement) => {
      const label = input.nextElementSibling as HTMLElement;
      const labelVal = label.innerHTML;

      input.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        let fileName = '';

        if (target.files && target.files.length > 1) {
          fileName = (target.getAttribute('data-multiple-caption') || '').replace('{count}', target.files.length.toString());
        } else {
          fileName = target.value.split('\\').pop() || '';
        }

        if (fileName) {
          label.querySelector('span')!.innerHTML = fileName;
        } else {
          label.innerHTML = labelVal;
        }
      });
    });
  }
}
