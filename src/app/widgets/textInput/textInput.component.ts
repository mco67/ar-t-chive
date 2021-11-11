import { Component, Input, ViewChild, ElementRef, forwardRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl, ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
    selector: 'textInput',
    styleUrls: ['./textInput.component.scss'],
    templateUrl: './textInput.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextInputComponent),
        multi: true
    }]
})

export class TextInputComponent implements ControlValueAccessor {

    public errors: any[] = [];
    public innerValue: string = '';
    public type: string = 'text';

    private notEscapedValue: string = '';
    private subscription: Subscription | null = null;
    private formErrors: any | null = null;

    @Input() formControl: FormControl = new FormControl();
    @Input() readOnly: boolean = false;
    @Input() readOnlyInfo: boolean = false;
    @Input() label: string | null = null;
    @Input() placeHolder: string = "";
    @Input() errorClass: string | null = null;
    @Input() password: boolean = false;
    @Input() passwordEye: boolean = false;
    @Input() maxLength: number = 128;
    @Input() focus: boolean = false;
    @Input() autoComplete: string = "on";

    @ViewChild('input', { 'static': false }) inputElemRef: ElementRef | undefined;

    get value(): any { return this.notEscapedValue; }
    set value(value: any) { if (value !== this.notEscapedValue) { this.notEscapedValue = value; } }

    public constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public i18n: TranslateService
    ) { }

    public ngOnInit(): void {
        this.formErrors = this.formControl.errors;
        if (this.password) { this.type = 'password'; }

        this.subscription = this.formControl.statusChanges.subscribe((status) => {
            if (status === "INVALID") {
                Object.keys(this.formErrors).forEach((key) => {
                    if (key === "required") { this.errors.push('errorMandatoryField'); }
                    else if (key === "email") { this.errors.push('emailfield-error'); }
                    else { this.errors.push(this.formErrors[key]); }
                });
                this.errorClass = "textInputError";
            }
            else { this.errorClass = null; }
            this.changeDetectorRef.detectChanges();
        });
    }

    public ngAfterViewInit(): void {
        if (this.focus && this.inputElemRef) { this.inputElemRef.nativeElement.focus(); }
    }

    public ngOnDestroy(): void {
        this.changeDetectorRef.detach();
        if (this.subscription) this.subscription.unsubscribe();
    }

    public onChange(__event: Event, value: any) {
        this.notEscapedValue = value;
        this.propagateChange(this.notEscapedValue);
        this.errors = [];

        if (this.formErrors) {
            Object.keys(this.formErrors).forEach((key) => {
                if (this.errors.length === 0) {
                    if (key === "required") { this.errors.push('errorMandatoryField'); }
                    else if (key === "whitespace") { this.errors.push('errorWhitespaceOnly'); }
                    else if (key === "email") { this.errors.push('emailfield-error'); }
                    else if (key === "pattern") { this.errors.push('invalidCharacter'); }
                    else if (key === "maxlength") { this.errors.push(this.i18n.instant('fieldMaxLengthError', { length: this.formErrors[key].requiredLength })); }
                    else if (key === "minlength") { this.errors.push(this.i18n.instant('fieldMinLengthError', { length: this.formErrors[key].requiredLength })); }
                    else { this.errors.push((this.formControl as any).errors[key]); }
                }
            });
            this.errorClass = "textInputError";
        }
        else { this.errorClass = null; }
        this.changeDetectorRef.detectChanges();
    }

    public toggleShowPassword(): void { this.type = this.type === 'text' ? 'password' : 'text'; } 

    public writeValue(value: any) { this.notEscapedValue = value; this.innerValue = value; }//_escape(value); 
    private propagateChange = (__event: any) => { };
    public registerOnChange(fn: any) { this.propagateChange = fn; }
    public registerOnTouched(__funct: any) { }
}