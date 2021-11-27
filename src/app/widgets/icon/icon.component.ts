import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'icon',
	templateUrl: './icon.component.html',
	styleUrls: ['./icon.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class IconComponent {
	constructor(private changeDetectorRef: ChangeDetectorRef) { }
	
	@Input() public name: string = '';

	public ngAfterViewInit(): void {
		this.changeDetectorRef.detach();
	}

}
