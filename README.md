# Grapher
I love Desmos and use it all the time, but I was disappointed when I found out they didn't support slope and vector fields. So I decided to take on the challenge and code my own graphing calc with the desired functionality. After a lot of hard work and some intense mathematics 🙂, I'm proud to present the result, Grapher!

## Features
* Graph functions, slope fields, vector fields, polar, and parametric
* Zoom in and out (with animations 🥳)
* Beautiful rendering on Javascript canvas
* Powerful and intuitive syntax
* Set custom domain for polar and parametric graphs

## Guide + Demos
**Functions:** Enter a function f(x) by writing any expression with the x variable. Separate multiple graphs with semicolons. 

<p align = "center">
<img src = "https://raw.githubusercontent.com/rohanphanse/grapher/main/images/functions.png" width = "75%" alt = "Function Demo" />
</p>

**Slope Fields:** Use the prefix `s:` and enter an expression in terms of x and y.
<p align = "center">
<img src = "https://raw.githubusercontent.com/rohanphanse/grapher/main/images/slope-field.png" width = "75%" alt = "Slope Field Demo" style = "margin: 0 auto" />
</p>

**Vector Fields:** Use the prefix `v:` and enter 2 expressions in terms of x and y inside parentheses separated by a comma. The 2 expressions represent the x- and y-components of the vector respectively.

<p align="center">
<img src = "https://raw.githubusercontent.com/rohanphanse/grapher/main/images/dipole.png" width = "75%" alt = "Vector Field Demo" style = "margin: 0 auto" />
</p>

**Polar:** Use the prefix `r = ` and enter an expression in terms of `t`.

Rose and Limacons | Spiral and Circles
--- | ---
![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/rose.png) | ![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/spiral.png)
![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/limacons.png) | ![](https://raw.githubusercontent.com/rohanphanse/grapher/main/images/limacons.png)
