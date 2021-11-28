import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'waveButton',
	templateUrl: './waveButton.component.html',
	styleUrls: ['./waveButton.component.scss']
})
export class WaveButtonComponent implements OnChanges {

	public rippleTop: string = '50%';
	public rippleLeft: string = '50%';
	public buttonClass: string = '';

	@Input() public icon: string|null = null;
	@Input() public label: string|null = null;
	@Input() public disabled: boolean = false;
	@Input() public type: string = 'button';
	@Input() public buttonType: string = ''
	@Input() public routerLink: EventEmitter<void> = new EventEmitter<void>();
	@Output() public onClick: EventEmitter<void> = new EventEmitter<void>();

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.disabled) {
			this.buttonClass = changes.disabled.currentValue ? 'disabled' : '';
		}
	}

	public internalClick($event: any) {
		if (typeof this.routerLink === 'string') { return; }
		this.rippleTop = $event.offsetY + 'px';
		this.rippleLeft = $event.offsetX + 'px';
		this.buttonClass = 'is-active';
		this.onClick.emit();
	}

	public animationEnd() { this.buttonClass = ''; }
}
