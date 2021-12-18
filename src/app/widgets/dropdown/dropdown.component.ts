/* eslint-disable no-multi-str */

import { Component, ViewEncapsulation, ElementRef, Input, Output, EventEmitter, Inject, ChangeDetectorRef, Injectable, ContentChild, SimpleChanges, ViewRef } from '@angular/core';
import { Renderer2, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class DropdownService {
    private idCounter: number = 0;
    public rxSubject: Subject<any> = new Subject<any>();
    public getDropdownId(): string { return 'ddw_' + (this.idCounter++); }
    public closeDropdown(): void { this.rxSubject.next(null); }
}

@Component({
    selector: 'dropdown',
    template: '\
        <div class="dropdownComponent">\
            <ng-content #DDownElem select="dropdown-elem"></ng-content>\
            <div *ngIf="display"[class]="class">\
                <ng-container *ngTemplateOutlet="templateRef"></ng-container>\
            </div>\
        </div>',
    host: { '(document:click)': 'onDocumentClick($event)' },
    styleUrls: ['./dropdown.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DropdownComponent {
    public display: boolean = false;
    public class: string | null = null
    public changeDetectorRef: ChangeDetectorRef;
    public dropdownElemComponent: DropdownElemComponent | null = null;

    @ContentChild(TemplateRef) templateRef: TemplateRef<any> | null = null;
    @Input() public position: string = 'bottom-left';

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef) {
        this.changeDetectorRef = changeDetectorRef;
    }

    public ngOnInit(): void {
        this.class = `dropdown-content ${this.position}`;
    }

    public ngOnDestroy(): void {
        this.changeDetectorRef.detach();
    }

    public displayStatus(displayStatus: boolean): void {
        this.display = displayStatus;
        this.detectChanges();
        if (this.dropdownElemComponent) {
            this.dropdownElemComponent.display = displayStatus;
            this.dropdownElemComponent.detectChanges();
        }
    }

    public updatePosition(verticalPosition: string): void {
        let position = verticalPosition;
        const positions = this.position.split('-');
        if (positions[1]) { position += '-' + positions[1]; }
        this.class = `dropdown-content ${position}`;
    }

    public onDocumentClick(event: any) {
        if (this.display && !this.elementRef.nativeElement.contains(event.target)) {
            this.display = false;
            this.displayStatus(this.display);
            this.detectChanges();
        }
    }

    private detectChanges() {
        if (!(this.changeDetectorRef as ViewRef).destroyed) { this.changeDetectorRef.detectChanges(); }
    }
}

@Component({
    selector: 'dropdown-elem',
    template: '\
        <div class="dropdown-elem {{class}}" (click)="onClick(); $event.stopPropagation();">\
            <ng-content></ng-content>\
            <div *ngIf="display" class="dropdown-elem-{{position}}"></div>\
        </div>'
})
export class DropdownElemComponent {
    private id: string;
    private subscription: Subscription;
    public position: string;
    public class: string = '';
    public display: boolean = false;
    public changeDetectorRef: ChangeDetectorRef;

    @Input() public disable: boolean = false
    @Input() public positionParams: any = null;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        private dropdownComponent: DropdownComponent,
        private dropdownService: DropdownService,
        private elementRef: ElementRef) {
        this.changeDetectorRef = changeDetectorRef;
        dropdownComponent.dropdownElemComponent = this;
        this.id = this.dropdownService.getDropdownId();
        this.subscription = this.dropdownService.rxSubject.subscribe((id) => {
            if (id !== this.id && this.display) {
                this.display = false;
                this.dropdownComponent.displayStatus(this.display);
                this.changeDetectorRef.detectChanges();
            }
        });
        this.position = this.dropdownComponent.position.split('-')[0];

    }

    public ngOnDestroy(): void {
        this.changeDetectorRef.detach();
        if (this.subscription) { this.subscription.unsubscribe(); }
    }

    public onClick(): void {
        if (!this.disable) {
            if (this.positionParams) {
                const dropdownCompElem = this.elementRef.nativeElement.closest(this.positionParams.refElemSel);
                const scrollElem = this.elementRef.nativeElement.closest(this.positionParams.scrollElemSel);
                if (dropdownCompElem && scrollElem) {
                    const availableTopSpace = this.getOffsetTop(dropdownCompElem, scrollElem);
                    const availableBottomSpace = scrollElem.offsetHeight - (availableTopSpace - scrollElem.scrollTop);
                    // If the top space is too small, we force the position at bottom (because if positionned at top,
                    // a top part of the dropdown menu will be hidden and not reachable!),
                    // otherwise we set the postion to bottom or top if not enough spaece below
                    this.position = (availableTopSpace < this.positionParams.minHeight) ? 'bottom' :
                        ((availableBottomSpace < this.positionParams.minHeight) ? 'top' : 'bottom');
                    this.dropdownComponent.updatePosition(this.position);
                }
            }
            this.display = !this.display;
            this.dropdownComponent.displayStatus(this.display);
            this.detectChanges();
            this.dropdownService.rxSubject.next(this.id);
        }
    }

    public onDocumentClick(event: Event): void {
        if (this.display && !this.elementRef.nativeElement.contains(event.target)) {
            this.display = false;
            this.dropdownComponent.displayStatus(this.display);
            this.detectChanges();
        }
    }

    public getOffsetTop(element, scrollElem) {
        let offsetTop = 0;
        while (element) {
            offsetTop += element.offsetTop;
            element = element.offsetParent;
            if (element === scrollElem) {
                break;
            }
        }
        return offsetTop;
    }

    public openDropdown() {
        this.onClick();
    }

    public detectChanges() {
        if (!(this.changeDetectorRef as ViewRef).destroyed) { this.changeDetectorRef.detectChanges(); }
    }
}

@Component({
    selector: 'dropdown-item',
    template: '\
        <div *ngIf="isStandard" class="dropdown-item {{class}}" (click)="internalAction($event);">\
            <div class="dropdown-item-icon material-icons-outlined" *ngIf="icon">{{icon}}</div>\
            <div class="dropdown-item-labels" *ngIf="translatedLabel">\
                <div *ngIf="label" class="dropdown-item-label" [translate]="label"></div>\
                <div *ngIf="details" class="dropdown-item-details" [innerHtml]="translatedDetails"></div>\
            </div>\
            <ng-content></ng-content>\
        </div>\
        <div *ngIf="isRadio" class="dropdown-item {{class}}" (click)="internalAction($event);">\
            <input type="radio" class="dropdown-item-input" ([ngModel])="select" [checked]="select">\
            <label class="dropdown-item-labels dropdown-item-input-label" [innerHtml]="translatedLabel"></label>\
            <div class="dropdown-item-icon dropdown-item-input-icon material-icons-outlined" *ngIf="icon">{{icon}}</div>\
            <ng-content></ng-content>\
        </div>\
        <label *ngIf="isFiles" label class="dropdown-item" (click)="fileClick(); $event.stopPropagation();">\
            <input #fileInput id="fileInput" type="file" multiple/>\
            <div class="dropdown-item-icon material-icons-outlined" *ngIf="icon">{{icon}}</div>\
            <span *ngIf="label" [innerHtml]="translatedLabel"></span>\
            <ng-content></ng-content>\
        </label>\
        <a *ngIf="href" class="dropdown-item" [href]="href" target="_blank" (click)="internalAction($event);">\
            <div class="dropdown-item-icon material-icons-outlined" *ngIf="icon">{{icon}}</div>\
            <div class="dropdown-item-labels">\
                <div *ngIf="label" [innerHtml]="translatedLabel"></div>\
                <div *ngIf="details" class="dropdown-item-details" [innerHtml]="translatedDetails"></div>\
            </div>\
            <ng-content></ng-content>\
        </a>',
    encapsulation: ViewEncapsulation.None
})
export class DropdownItemComponent {

    public translatedLabel!: string;
    public translatedDetails!: string;
    public isStandard: boolean = false;
    public isFiles: boolean = false;
    public class: string = '';
    public isRadio: boolean = false;
    private rendererListener: any;

    @ViewChild('fileInput') public inputElementRef: ElementRef | null = null;
    @Output() public action = new EventEmitter<any>();
    @Input() public icon: string | null = null;
    @Input() public imgSrc: string | null = null;
    @Input() public label!: string;
    @Input() public details: string | null = null;
    @Input() public type: string | null = null;
    @Input() public inputType: string | null = null;
    @Input() public href: string | null = null;
    @Input() public disable: boolean = false;
    @Input() public select: boolean = false;
    @Input() public stopPropagation: boolean = false;

    constructor(
        public i18n: TranslateService,
        private dropdownService: DropdownService,
        private renderer: Renderer2,
        private changeDetectorRef: ChangeDetectorRef) {
      
        this.isStandard = this.type !== "files" && this.inputType !== "radio" && !this.href;
        this.isFiles = this.type === "files";
        this.isRadio = this.inputType === "radio";
        this.class = (this.select && !this.isRadio) ? 'dropdown-item-select' : '';
        this.class = this.disable ? 'dropdown-item-disable' : this.class;
    }

    public ngOnInit():void {
        this.translatedLabel = this.label ? this.i18n.instant(this.label) : null;
        this.translatedDetails = this.details ? this.i18n.instant(this.details) : null;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.disable && !changes.disable.isFirstChange()) {
            this.class = this.disable ? 'dropdown-item-disable' : this.class;
        }
    }

    public ngOnDestroy(): void {
        this.changeDetectorRef.detach();
        if (this.rendererListener) { this.rendererListener(); }
    }

    public fileClick(): void {
        if (this.rendererListener) { this.rendererListener(); }
        if (this.inputElementRef) {
            this.rendererListener = this.renderer.listen(this.inputElementRef.nativeElement, 'change', (event) => {
                if (event.target.files && event.target.files.length > 0) {
                    this.action.emit(event.target.files);
                    this.dropdownService.rxSubject.next(null);
                    event.currentTarget.value = "";
                }
            });
        }
    }

    public internalAction($event: any): void {
        if (this.stopPropagation) { $event.stopPropagation(); }
        if (!this.disable) {
            this.action.emit();
            this.dropdownService.closeDropdown();
        }
    }
}

@Component({
    selector: 'dropdown-separator',
    template: '<div class="dropdown-separator"></div>'
})
export class DropdownSeparatorComponent { }

@Component({
    selector: 'dropdown-title',
    template: '<div class="dropdown-title" [translate]="label"></div>'
})
export class DropdownTitleComponent {
    @Input() public label: string = '';
}
