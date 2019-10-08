# MaTerial
A material design inspired theme for [Bootstrap](https://getbootstrap.com).  
A demo of the theme can be found at https://mafrans.github.io/MaTerial

# Installation
MaTerial requires [jQuery](https://jquery.com) and [Bootstrap](https://getbootstrap.com) and should be placed far down in the script list. If any effects stop working, this can be due to MaTerial's window load listener being overridden by another javascript file, and MaTerial needs to be placed forther down in the script list.

```html
<link rel="stylesheet" href="https://raw.githubusercontent.com/Mafrans/MaTerial/master/MaTerial.css">
<script rel="stylesheet" href="https://raw.githubusercontent.com/Mafrans/MaTerial/master/MaTerial.js">
```

# How to use
## Buttons
MaTerial introduces three new types of buttons, they can be implemented using the classes `.btn-raised`, `.btn-border`, and `.btn-text`. These can then be colored using your standard `.btn-primary/.btn-secondary/.btn-success/...` Bootstrap classes.

## Effects
MaTerial also introduces two unique click effects that can be used on any element that supports children (image tags and other tags that do not support children will have to be wrapped in a container with the effect to properly work).

The simplest way to add an effect is to use it's respective class, along with the base class `.ma_effect`.
| Effect        | Class            |
| ------------- |------------------|
| Ripple        | `.ma_ripple`     |
| Slide Right   | `.ma_slide-right`|
| Slide Left    | `.ma_slide-left` |
| Slide Up      | `.ma_slide-up`   |
| Slide Down    | `.ma_slide-down` |

If you want to color your effect, you cannot use classes, but instead have to use javascript to add your effects. Remember to run your effects in the window load event, so that images and other media will load before MaTerial attempts to create the effect canvas. Using this method still requires the base `.ma_effect` class to be applied.
```javascript
ma_.addEffect(
    "slide", // ripple, slide
    ".mySelector", { // Supports all jQuery selectors 
        color: [128, 255, 63], // [r, g, b]
        type: "right" // right, left, up down 
    });
```

Buttons automatically gain a color when using class based effects, but when using the `addEffect` javascript function you will have to define the color manually.