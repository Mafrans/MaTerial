var ma_ = {
    effect: {}
};


CanvasRenderingContext2D.prototype.clear =
    CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
        if (preserveTransform) {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
        }

        this.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (preserveTransform) {
            this.restore();
        }
    };

ma_.addEffect = function (type, obj, options) {
    switch (type.toLowerCase()) {
        case "ripple":
            ma_.addRippleEffect(obj, options);
            break;
        case "slide":
            ma_.addSlideEffect(obj, options);
            break;
    }
}


var clicking = false;
prepareEffect = function (obj, options, then) {
    var objects = $(obj);
    var clickstyle = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';

    if (options == undefined) options = {
        color: null,
        type: null
    };

    objects.each((index, elem) => {
        let object = $(elem);

        let canvas = $("<canvas class='ma_ecnv' width='" + Math.round(object.outerWidth()) + "' height='" + Math.round(object.outerHeight()) + "'></canvas>").appendTo(object);

        object.off(".ma_effect");

        then(object, canvas, options, clickstyle);
    });
}


function resizeCanvases() {
    $("canvas.ma_ecnv").each((i, e)=>{
        
        var canvas = $(e);
        var parent = canvas.parent();

        canvas.attr("width", Math.round(parent.outerWidth()))
        .attr("height", Math.round(parent.outerHeight()))
    });
}

ma_.addRippleEffect = function (obj, options) {
    prepareEffect(obj, options, (object, canvas, options, clickstyle) => {
        var bRadius = object.css("MozBorderRadius");

        if (!bRadius) {
            var bRadius = object.css("-webkit-border-top-left-radius") + " " +
                object.css("-webkit-border-top-right-radius") + " " +
                object.css("-webkit-border-bottom-left-radius") + " " +
                object.css("-webkit-border-bottom-right-radius");
        }
        canvas.css("border-radius", bRadius);

        var startOpacity = 0.3;
        if (options.opacity) {
            startOpacity = options.opacity;
        }

        var startRadius = object.outerWidth() / 3;

        var radius = startRadius;
        var rPercent = radius / 100;
        var opacity = startOpacity;
        var oPercent = opacity / 100;

        var ctx = canvas[0].getContext("2d");

        var _x;
        var _y;
        var stopUp;

        object.on(clickstyle + ".ma_effect", (event) => {
            stopUp = true;


            if (clicking) return;
            clicking = true;

            opacity = startOpacity;
            radius = startRadius;

            _x = event.pageX - canvas.offset().left;
            _y = event.pageY - canvas.offset().top;

            if (clickstyle == "touchstart") {
                _x = event.changedTouches[0].pageX - canvas.offset().left;
                _y = event.changedTouches[0].pageY - canvas.offset().top;
            }

            var animate = function () {
                window.requestAnimationFrame(() => {
                    ctx.clear();

                    ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                    if (options.color) {
                        ctx.fillStyle = "rgba(" + options.color[0] + ", " + options.color[1] + ", " + options.color[2] + ", " + opacity + ")";
                    }

                    ctx.beginPath();
                    ctx.arc(_x, _y, radius, 0, 2 * Math.PI);
                    ctx.fill();

                    radius += rPercent * 15;

                    if (radius < object.outerWidth() * 2) {
                        animate();
                    }
                });
            };
            animate();
        })

        object.on("mouseup.ma_effect touchend.ma_effect", (event) => {
            stopUp = false;
            clicking = false;

            var animate = function () {
                window.requestAnimationFrame(() => {
                    ctx.clear();
                    if (stopUp) return;

                    ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                    if (options.color) {
                        ctx.fillStyle = "rgba(" + options.color[0] + ", " + options.color[1] + ", " + options.color[2] + ", " + opacity + ")";
                    }

                    ctx.beginPath();
                    ctx.arc(_x, _y, radius, 0, 2 * Math.PI);
                    ctx.fill();

                    opacity -= oPercent * 5;

                    if (opacity > 0) {
                        animate();
                    }
                });
            };
            animate();
        })
    })
}

ma_.addSlideEffect = function (obj, options) {
    prepareEffect(obj, options, (object, canvas, options, clickstyle) => {
        var bRadius = object.css("MozBorderRadius");

        if (!bRadius) {
            var bRadius = object.css("-webkit-border-top-left-radius") + " " +
                object.css("-webkit-border-top-right-radius") + " " +
                object.css("-webkit-border-bottom-left-radius") + " " +
                object.css("-webkit-border-bottom-right-radius");
        }
        canvas.css("border-radius", bRadius);

        var startOpacity = 0.3;
        if (options.opacity) {
            startOpacity = options.opacity;
        }

        var startSize = 0;

        var size = startSize;
        var sPercent = object.outerWidth() / 100;
        if (options.type == "up" || options.type == "down") {
            var sPercent = object.outerHeight() / 100;
        }
        var opacity = startOpacity;
        var oPercent = opacity / 100;

        var ctx = canvas[0].getContext("2d");

        var _x;
        var _y;
        var stopUp;

        object.on(clickstyle + ".ma_effect", (event) => {
            stopUp = true;


            if (clicking) return;
            clicking = true;

            opacity = startOpacity;
            size = startSize;

            var animate = function () {
                window.requestAnimationFrame(() => {
                    ctx.clear();

                    ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                    if (options.color) {
                        ctx.fillStyle = "rgba(" + options.color[0] + ", " + options.color[1] + ", " + options.color[2] + ", " + opacity + ")";
                    }

                    ctx.beginPath();
                    switch (options.type) {
                        case "right":
                            ctx.rect(0, 0, size, object.outerHeight());
                            break;
                        case "left":
                            ctx.rect(object.outerWidth() - size, 0, size, object.outerHeight());
                            break;
                        case "down":
                            ctx.rect(0, 0, object.outerWidth(), size);
                            break;
                        case "up":
                            ctx.rect(0, object.outerHeight() - size, object.outerWidth(), size);
                            break;
                    }
                    ctx.fill();

                    size += sPercent * 15;

                    switch (options.type) {
                        case "right":
                        case "left":
                            if (size < object.outerWidth() * 1.1) {
                                animate();
                            }
                            break;

                        case "up":
                        case "down":
                            if (size < object.outerHeight() * 1.1) {
                                animate();
                            }
                            break;
                    }

                });
            };
            animate();
        })

        object.on("mouseup.ma_effect touchend.ma_effect", (event) => {
            stopUp = false;
            clicking = false;

            var animate = function () {
                window.requestAnimationFrame(() => {
                    ctx.clear();
                    if (stopUp) return;

                    ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                    if (options.color) {
                        ctx.fillStyle = "rgba(" + options.color[0] + ", " + options.color[1] + ", " + options.color[2] + ", " + opacity + ")";
                    }

                    ctx.beginPath();
                    switch (options.type) {
                        case "right":
                            ctx.rect(0, 0, size, object.outerHeight());
                            break;
                        case "left":
                            ctx.rect(object.outerWidth() - size, 0, size, object.outerHeight());
                            break;
                        case "down":
                            ctx.rect(0, 0, object.outerWidth(), size);
                            break;
                        case "up":
                            ctx.rect(0, object.outerHeight() - size, object.outerWidth(), size);
                            break;
                    }
                    ctx.fill();

                    opacity -= oPercent * 5;

                    if (opacity > 0) {
                        animate();
                    }
                });
            };
            animate();
        })
    })
}


function parseRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ];
    } else {
        return hex.replace(/[^\d,]/g, '').split(',');
    }
}


$(() => {
    $(window).on("resize", ()=>{
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function(){
            resizeCanvases();
        }, 250);
    })
})

var bodyStyles = window.getComputedStyle(document.body);
const colors = {
    primary: bodyStyles.getPropertyValue('--primary'),
    secondary: bodyStyles.getPropertyValue('--secondary'),
    success: bodyStyles.getPropertyValue('--success'),
    danger: bodyStyles.getPropertyValue('--danger'),
    warning: bodyStyles.getPropertyValue('--warning'),
    info: bodyStyles.getPropertyValue('--info'),
    dark: bodyStyles.getPropertyValue('--dark'),
    light: bodyStyles.getPropertyValue('--light'),
}
const types = {
    ripple: [],
    slide: [
        "right",
        "left",
        "up",
        "down"
    ]
}
const styles = {
    default: "light", // Default is more generic, so it is parsed first

    border: "normal",
    text: "normal",
    raised: "light"
}

window.addEventListener("load", () => {
    ma_.addEffect("ripple", ".ma_effect.ma_ripple");

    for (typeName in types) {
        if (types[typeName].length == 0) {
            ma_.addEffect(typeName, ".ma_effect.ma_" + typeName);
            console.log(".ma_effect.ma_" + typeName);

            for (colorName in colors) {
                for (styleName in styles) {
                    style = styles[styleName];
                    color = parseRgb(colors[colorName]);

                    /* 
                    *  Add/remove instead of setting the color, as too much of a
                    *  color contrast would make the color less pleasing to the eye
                    */
                    if (style == "light") {
                        color[0] = Math.min(color[0] + 100, 255);
                        color[1] = Math.min(color[1] + 100, 255);
                        color[2] = Math.min(color[2] + 100, 255);
                    }
                    if (style == "dark" || colorName == "light") {
                        color[0] = Math.max(color[0] - 100, 0);
                        color[1] = Math.max(color[1] - 100, 0);
                        color[2] = Math.max(color[2] - 100, 0);
                    }
                    console.log("type", typeName, ", style", style, ", color", color)

                    if (styleName == "default") {
                        ma_.addEffect(
                            typeName,
                            ".btn.btn-" + colorName + ".ma_effect.ma_" + typeName, {
                            color: color,
                        });
                        continue;
                    }

                    ma_.addEffect(
                        typeName,
                        ".btn.btn-" + styleName + ".btn-" + colorName + ".ma_effect.ma_" + typeName, {
                        color: color
                    });
                }
            }
        }
        for (type of types[typeName]) {
            ma_.addEffect(typeName + "-" + type, ".ma_effect.ma_" + typeName + "-" + type, {
                type: type
            });
            console.log(typeName + "-" + type, ".ma_effect.ma_" + typeName + "-" + type);

            for (colorName in colors) {
                for (styleName in styles) {
                    style = styles[styleName];
                    color = parseRgb(colors[colorName]);
                    if (style == "light") {
                        color[0] = Math.min(color[0] + 50, 255);
                        color[1] = Math.min(color[1] + 50, 255);
                        color[2] = Math.min(color[2] + 50, 255);
                    }
                    if (style == "dark") {
                        color[0] = Math.max(color[0] - 50, 0);
                        color[1] = Math.max(color[1] - 50, 0);
                        color[2] = Math.max(color[2] - 50, 0);
                    }

                    if (styleName == "default") {
                        ma_.addEffect(
                            typeName,
                            ".btn.btn-" + colorName + ".ma_effect.ma_" + typeName + "-" + type, {
                            color: color,
                            type: type
                        });
                        continue;
                    }

                    console.log("type", typeName, ", style", style, ", color", color)
                    ma_.addEffect(
                        typeName,
                        ".btn.btn-" + styleName + ".btn-" + colorName + ".ma_effect.ma_" + typeName + "-" + type, {
                        color: color,
                        type: type
                    });
                }
            }
        }
    }
});