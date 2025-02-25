import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton-simple',
  imports: [SkeletonModule],
  template: `
  <p-skeleton height="3rem" styleClass="mb-4" />
  <p-skeleton height="3rem" styleClass="mb-4" />
  <p-skeleton height="3rem" styleClass="mb-4" />
  <p-skeleton height="3rem" styleClass="mb-4" />
  <p-skeleton height="3rem" styleClass="mb-4" />
  <p-skeleton height="3rem" styleClass="mb-4" />
  `,
})
export class SkeletonSimpleComponent {
}
