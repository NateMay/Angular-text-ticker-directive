import { Directive, ElementRef, HostListener, Input, Renderer, OnInit } from '@angular/core';

@Directive({ selector: '[ticker]' })
export class TickerDirective implements OnInit {

    margin: number; // margin of the text nodes which decrements to tick to the left
    interval: any;  // used to kill the setTimout 
    firstNode: any; // the node which displays first and without mouseover 
    view: any[];    // an array of nodes attached to the main node to provide a seemless scroll
    textWidth: number;
    idle: boolean;

    @Input('speed') speed: number;                  // milliseconds between ticks
    @Input('padding-right') paddingRight: number;
    @Input('size') size: number;
    @Input('trigger') trigger: string;
    @Input('text') text: string;

    constructor(private el: ElementRef, private r: Renderer) {  }

    @HostListener('mouseenter') onMouseEnter(): void  {
        if ( this.trigger === 'onMouseEnter') {
            this.initTicker();
        }
    }

    @HostListener('click') onClick(): void  {
        if ( this.trigger === 'onClick') {
            if ( this.idle ) {
                this.initTicker();
            } else {
                this.reset();
            }
            this.idle = !this.idle;
        }
    }

    initTicker(): void {
        if (this.tickerNeeded()) {
            this.margin = 0;

            this.view = [
                this.createTickerNode( '<T>', this.text ),
                this.createTickerNode( '<T>', this.text )
            ];

            this.r.attachViewAfter( this.firstNode, this.view );
            this.moveLeft();
        }
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        if (this.tickerNeeded() && this.trigger === 'onMouseEnter') {
            this.reset();
        }
    }

    reset(): void {
        clearInterval( this.interval );
        this.r.detachView( this.view );
        this.r.setElementStyle( this.firstNode, 'margin-left', '0' );
    }

    ngOnInit(): void {
        this.setIgnoredAtts();
        this.textWidth = this.getTextWidth();
        this.firstNode = this.createTickerNode( this.firstNode, this.text );
        if ( this.trigger === 'auto' && this.tickerNeeded()) {
            this.initTicker();
        }
    }

    setIgnoredAtts(): void {
        if ( !this.paddingRight ) { this.paddingRight = 16; }
        if ( !this.speed )        { this.speed = 25; }
        if ( !this.trigger )      { this.trigger = 'onMouseEnter'; }
        if ( !this.size )         { this.size = 16; }
        if ( !this.text )         { this.text = 'You need to add the [text] attribute to the "ticker" directive'; }
        this.idle = true;
    }

    createTickerNode( self: any , text: string ): any {
        self = this.r.createElement( this.el.nativeElement, 'span' );
        this.r.setElementStyle( self, 'padding-right', this.paddingRight + 'px');
        this.r.setElementStyle( self, 'font-size', this.size + 'px');
        this.r.setText( self, text );
        return self;
    }

    moveLeft(): void {
        let resetMargin = ( this.textWidth + this.paddingRight ) * -2 ;
        this.interval = setInterval(() => {
            this.r.setElementStyle( this.firstNode, 'margin-left', this.margin-- + 'px' );
            if (this.margin < resetMargin) { this.margin = 0; }
        }, this.speed);
    }

    getTextWidth(): number {
        let t = this.r.createElement( document.getElementById('ghost'), 'div' );
        this.r.setText( t, this.text );
        this.r.setElementStyle( t, 'font-size', this.size + 'px');
        let w = t.offsetWidth;
        t.innerHTML = '';
        return w;
    }

    tickerNeeded(): boolean {
        return this.textWidth > this.el.nativeElement.parentElement.offsetWidth - 2;
    }
}
