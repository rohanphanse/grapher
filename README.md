# Grapher
I love [Desmos](https://www.desmos.com/calculator) and use it all the time, but I was disappointed when I found out they didn't support slope and vector fields. So I decided to take on the challenge and code my own graphing calc with the desired functionality. After a lot of hard work and some intense mathematics 🙂, I'm proud to present the result, Grapher!

## Features
* Graph functions, slope fields, vector fields, polar, and parametric
* Zoom in and out (with animations 🥳)
* Beautiful rendering on Javascript canvas
* Powerful and intuitive syntax
* Set custom domain for polar and parametric graphs

## Guide + Demos
**Functions:** Enter a function f(x) by writing any expression with the `x` variable. Separate multiple graphs with semicolons. 

For this demo, I've graphed the parabola `x^2`, the sine curve `sin(x) - 2`, the line `-3(x + 4)`, and the function `1/x`.

<p align = "center">
<img src = "https://raw.githubusercontent.com/rohanphanse/grapher/main/images/functions.png" width = "75%" alt = "Function Demo" />
</p>

I'm using the wonderful [math.js](https://mathjs.org/docs/reference/functions.html) library for evaluating math expressions. Here are a few useful functions and constants you can use in Grapher.

* Trig functions: `sin(x)`, `cos(x)`, `tan(x)`, `sec(x)`, `asin(x)` (inverse sine), ...
* Square root: `sqrt(x)`
* Natural logarithm (base e): `log(x)`
* Constants: `pi`, `e`


**Slope Fields:** Start off with the prefix `s:` and enter an expression in terms of `x` and `y`.

For this demo, I'm graphing the family of sine curves `sin(x) + C` and the slope field of `cos(x)`. I've also included a hyperbola `x^2 - y^2 = 1` and the slope field `x/y`.

Sines | Hyperbola
--- | ---
![Sines Slope Field Demo](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/sines.png) | ![Hyperbola Slope Field Demo](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/hyperbola.png)
</p>

**Vector Fields:** Use the prefix `v:` and enter 2 expressions in terms of x and y inside parentheses separated by a comma. The 2 expressions represent the x- and y-components of the vector respectively.

<p align="center">
<img src = "https://raw.githubusercontent.com/rohanphanse/grapher/main/images/dipole.png" width = "75%" alt = "Vector Field Demo" style = "margin: 0 auto" />
</p>

**Polar:** Use the prefix `r = ` and enter an expression in terms of `t`.

Rose and Limacons | Spiral and Circles
--- | ---
![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/rose.png) | ![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/spiral.png)
![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/limacons.png) | ![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/circles.png)

Set custom domain for parameter variable t by specifying min and max inside of square brackets separated by comma. For example, `r = t [0, 16pi]` goes from t = 0 to t = 16pi. Default domain is `[0, 2pi]`.

**Parametric:** Enter parametric graphs in the form of `p: x = f(t), y = g(t)`. For this demo, I've graphed the beautiful [butterfly curve](https://en.wikipedia.org/wiki/Butterfly_curve_(transcendental)). Because this curve is so intricate, I upped the numbers of intervals from 1,000 (default) to 10,000.

<p align="center">
<img src = "https://raw.githubusercontent.com/rohanphanse/grapher/main/images/butterfly.png" width = "75%" alt = "Function Demo" />
</p>