import { Component, ViewEncapsulation } from '@angular/core';
import { UsersService } from 'src/app/services/users.services';

@Component({
    selector: 'createExhibition',
    templateUrl: 'createExhibition.component.html',
    styleUrls: ['createExhibition.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateExhibitionComponent {

    public constructor(private usersService: UsersService) {

    }

    public ngOnInit() {
     

    }

}