# Angular2-text-ticker-directive
An attribute directive that transforms an element into a never ending carousel of left scrolling text. Can take a single string or an array, a speed, a text size, and padding inputs of the element. Also frequently  called a "news ticker" or "stock ticker".

## Getting Started

Copy the `ticker.directive.ts` into your project.

declare `TickerDirective` in your  `NgModule` (or the root-most `NgModule`s that you will use it if you plan to lazy load)
````
import { TickerDirective } from './directives/ticker.directive';
...
@NgModule({
  declarations: [
    TickerDirective,
    ...
  ],
...
```

Add a "ghost" element anywhere in your application. This will be used to measure the length of the text in pixels.
```
<div id="ghost"></div>

#ghost{
    display: inline-block;
    height: 0;
    position: absolute;
}
```
## How to Use

Add the attribute `ticker` to the desired element and pass in the desired parameters

```
<div ticker [text]="food.name" [size]="30"></div>
```

## Parameters

* **Text:** `[text]="{{your.text}}"` - Can take a raw string, interpolated value from the component. Can be configured to take an array of strings (see comments in the directive)
* **Speed:** `[speed]="30"` - 1 tick every 30 milliseconds
* **Padding-right:** `[padding-right]='50'` - results in 50px between each set of scrolling text (defaults to 16px)
* **Size:** [size]="24" - results in `font-size: 24px;` (defaults to 16px)
