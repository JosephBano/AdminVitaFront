import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-skeleton-expand-info',
  imports: [
    SkeletonModule,
    DividerModule
  ],
  template: `
    <div class="flex flex-col mb-4">
        <div class="flex">
            <div class="w-full">
                <p-skeleton width="100%" height="200px" />
            </div>
            <p-divider layout="vertical" />
            <div class="w-full">
                <p-skeleton width="100%" height="200px" />
            </div>
            <p-divider layout="vertical" />
            <div class="w-full">
                <p-skeleton width="100%" height="130px" />
                <p-divider/>
                <p-skeleton height="3rem"></p-skeleton>
            </div>
        </div>
        <p-divider/>
        <p-skeleton width="100%" height="3rem" />
        <p-divider/>
        <div class="flex gap-2">
            <div class="w-full">
                <p-skeleton width="100%" height="2rem" />
            </div>
            <div class="w-full">
                <p-skeleton width="100%" height="2rem" />
            </div>
            <div class="w-full">
                <p-skeleton width="100%" height="2rem" />
            </div>
            <div class="w-full">
                <p-skeleton width="100%" height="2rem" />
            </div>
            <div class="w-full">
                <p-skeleton width="100%" height="2rem" />
            </div>
            <div class="w-full">
                <p-skeleton width="100%" height="2rem" />
            </div>
        </div>
    </div>
  `,
})
export class SkeletonExpandInfoComponent {

}
