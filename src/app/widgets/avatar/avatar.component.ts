import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
	selector: 'avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AvatarComponent {
	constructor(private changeDetectorRef: ChangeDetectorRef) { }
	
	@Input() public user: User | null = null;

	public ngAfterViewInit(): void {
		this.changeDetectorRef.detach();
	}

}
