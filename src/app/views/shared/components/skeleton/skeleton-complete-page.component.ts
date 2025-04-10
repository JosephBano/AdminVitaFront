import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-skeleton-complete-page',
    imports: [Skeleton],
    template: `
    <div class="flex flex-column gap-2 w-full">
        <div class="flex flex-row gap-2 w-full">
            <p-skeleton width="100%" height="3rem" />
            <p-skeleton width="100%" height="50rem" />
        </div>
        <p-skeleton width="100%" height="3rem" />
    </div>
    `,
    standalone: true,
})
export class SkeletonCompletePageComponent {
    // Add any necessary logic or properties here
}