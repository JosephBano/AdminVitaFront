import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-notfound',
  imports: [
    Button
  ],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {

  redirectToPanel(){
    window.location.href = '/panel';
  }
}
