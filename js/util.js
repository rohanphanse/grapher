// Utility functions
let calculator

// Count occurences in array or string
function count(array, value) {
    let counter = 0
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            counter++
        }
    }
    return counter
}

// Mean
function mean(nums) {
    return nums.reduce((a, b) => a + b) / nums.length
}

// Round
function round(n, p = 0) {
    return Math.round(n * 10 ** p) / (10 ** p)
}

function roundArray(a, p = 0) {
    // console.log("roundArray", JSON.stringify(a), p)
    for (let i = 0; i < a.length; i++) {
        if (typeof a[i] === "number") {
            a[i] = set_precision(a[i], p)
        } else if (Array.isArray(a[i])) {
            a[i] = roundArray(a[i], p)
        } else if (typeof a[i] === "object" && !(a[i] instanceof String)) {
            if ("op" in a[i]) {
                a[i] = `${a[i].op}`
            } else if ("d" in a[i]) {
                a[i] = new Fraction(a[i].n, a[i].d).toString()
            } else if ("b" in a[i]) {
                a[i] = `${a[i].b}`
            } else if ("unit" in a[i]) {
                a[i] = new UnitNumber(a[i].num, a[i].unit).toString()
            }
        }
    }
    return a
}

function set_precision(value, p) {
    if (value === 0 || !value.toString().includes(".")) return value
    return parseFloat(value.toPrecision(p))
}

function solve_quadratic(a, b, c) {
    const d = b**2 - 4*a*c
    if (d < 0) {
        return []
    } else if (d === 0) {
        return [-b / (2*a)]
    } else {
        return [(-b + Math.sqrt(d)) / (2*a), (-b - Math.sqrt(d)) / (2*a)] 
    }
}

// Credit to Alexander Shtuchkin: https://stackoverflow.com/questions/27176423/function-to-solve-cubic-equation-analytically
function solve_cubic(a, b, c, d) {
    if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
        a = b; b = c; c = d;
        if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
            a = b; b = c;
            if (Math.abs(a) < 1e-8) // Degenerate case
                return [];
            return [-b/a];
        }

        var D = b*b - 4*a*c;
        if (Math.abs(D) < 1e-8)
            return [-b/(2*a)];
        else if (D > 0)
            return [(-b+Math.sqrt(D))/(2*a), (-b-Math.sqrt(D))/(2*a)];
        return [];
    }

    // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
    var p = (3*a*c - b*b)/(3*a*a);
    var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
    var roots;

    if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
        roots = [Math.cbrt(-q)];
    } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
        roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
        var D = q*q/4 + p*p*p/27;
        if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
            roots = [-1.5*q/p, 3*q/p];
        } else if (D > 0) {             // Only one real root
            var u = Math.cbrt(-q/2 - Math.sqrt(D));
            roots = [u - p/(3*u)];
        } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
            var u = 2*Math.sqrt(-p/3);
            var t = Math.acos(3*q/p/u)/3;  // D < 0 implies p < 0 and acos argument in [-1..1]
            var k = 2*Math.PI/3;
            roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
        }
    }

    // Convert back from depressed cubic
    for (var i = 0; i < roots.length; i++)
        roots[i] -= b/(3*a);

    return roots;
}

function isInt32(n) {
    return n >= -2147483648 && n <= 2147483647
}

function convert_to_decimal(n, radix = 10) {
    if (n instanceof BaseNumber) {
        n = n.b
    }
    n = n.toString()
    for (const base in bases) {
        if (n.toString().startsWith(base)) {
            n = n.slice(2)
            radix = bases[base]
            break
        }
    }
    const N = parseInt(n, radix)
    if (n.length === 32 && n[0] === "1") {
        return N - Math.pow(2, 32)
    }
    return N
}

// Credit for following functions: Google Generative AI
function rref(m) {
    m = m.map(row => [...row]) // Copy matrix
    const R = m.length
    const C = m[0].length
    let lead = 0
    for (let r = 0; r < R; r++) {
        if (lead >= C) {
            return m
        }
        let i = r
        while (Math.abs(m[i][lead]) < 1e-10) {
            i++;
            if (i === R) {
                i = r
                lead++
                if (lead === C) {
                    return m
                }
            }
        }
        [m[r], m[i]] = [m[i], m[r]]
        let div = m[r][lead]
        for (let j = 0; j < C; j++) {
            m[r][j] /= div
        }
        for (let i = 0; i < R; i++) {
            if (i !== r) {
                let mult = m[i][lead];
                for (let j = 0; j < C; j++) {
                    m[i][j] -= mult * m[r][j]
                }
            }
        }
        lead++
    }
    return m
}

function det(m) {
    const L = m.length
    if (L === 1) {
      return m[0][0]
    }
    if (L === 2) {
      return m[0][0] * m[1][1] - m[0][1] * m[1][0]
    }
    let _det = 0
    for (let i = 0; i < L; i++) {
      const submatrix = m.slice(1).map(row => row.filter((_, j) => j !== i))
      _det += m[0][i] * Math.pow(-1, i) * det(submatrix)
    }
    return _det
}

function add_tensors(a1, a2, s2 = 1, s1 = 1) {
    if (!Array.isArray(a1) || !Array.isArray(a2)) {
        return "Invalid types"
    }
    if (a1.length !== a2.length) {
        return "Tensors must have same dimensions"
    }
    const result = []
    for (let i = 0; i < a1.length; i++) {
        if (Array.isArray(a1[i]) && Array.isArray(a2[i])) {
        result.push(add_tensors(a1[i], a2[i], s2, s1))
        } else if (typeof a1[i] === "number" && typeof a2[i] === "number"){
            result.push(a1[i] * s1 + a2[i] * s2)
        } else {
            return "Invalid types"
        }
    }
    return result
}

function tensor_add_scalar(a1, s, c = 1) {
    const result = []
    for (let i = 0; i < a1.length; i++) {
        if (Array.isArray(a1[i])) {
            result.push(tensor_add_scalar(a1[i], s, c))
        } else if (typeof a1[i] === "number"){
            result.push(c * a1[i] + s)
        } else {
            return "Invalid types"
        }
    }
    return result
}

function tensors_equal(a1, a2) {
    if (!Array.isArray(a1) || !Array.isArray(a2)) {
        return false
    }
    if (a1.length !== a2.length) {
        return false
    }
    for (let i = 0; i < a1.length; i++) {
        if (Array.isArray(a1[i]) && Array.isArray(a2[i])) {
            if (!tensors_equal(a1[i], a2[i])) {
                return false
            }
        } else if (typeof a1[i] === "number" && typeof a2[i] === "number") {
            if (a1[i] !== a2[i]) {
                return false
            }
        } else if (a1[i] instanceof UnitNumber && a2[i] instanceof UnitNumber) {
            return a1[i].value() === convert_to_unit(a2[i], a1[i].unit)
        } else if (a1[i] instanceof UnitNumber) {
            return a1[i].value() === a2[i]
        } else if (a2[i] instanceof UnitNumber) {
            return a1[i] === a2[i].value()
        } else {
            return false
        }
    }
    return true
}

function create_zero_tensor(dims) {
    if (dims.length === 0) {
      return 0
    }
    const size = dims[0]
    const rest = dims.slice(1)
    const tensor = []
    for (let i = 0; i < size; i++) {
      tensor.push(create_zero_tensor(rest));
    }
    return tensor
}

function inverse(m) {
    const R = m.length
    const C = m[0].length
    if (R !== C) {
        return "Expected square matrix"
    }
    const aug = m.map((row, i) => [...row, ...Array.from({ length: R }, (_, j) => (i === j ? 1 : 0))])
    const rref_aug = rref(aug)
    const inv = rref_aug.map(row => row.slice(C))
    for (let i = 0; i < R; i++) {
        for (let j = 0; j < C; j++) {
            const e = (i === j) ? 1 : 0;
            if (Math.abs(rref_aug[i][j] - e) > 1e-10) {
                return "Not invertible"
            }
        }
    }
    return inv
}

function matmul(A, B) {
    const RA = A.length
    const CA = A[0].length
    const RB = B.length;
    const CB = B[0].length
    if (RB !== CA) {
        return "Incompatible dimensions"
    }
    const result = Array(RA).fill(null).map(() => Array(CB).fill(0))
    for (let i = 0; i < RA; i++) {
        for (let j = 0; j < CB; j++) {
            for (let k = 0; k < CA; k++) {
                result[i][j] += A[i][k] * B[k][j]
            }
        }
    }
    return result
}

function matmul_scalar(A, s) {
    const result = []
    for (let i = 0; i < A.length; i++) {
        result.push([])
        for (let j = 0; j < A[0].length; j++) {
            result[i].push(A[i][j] * s)
        }
    }
    return result
}

function factorial(n) {
    if (n > 200) {
        return Infinity
    }
    let value = 1
    for (let i = 2; i <= n; i++) {
        value *= i
    }
    return value
}

function flatten(a) {
    if (!Array.isArray(a)) {
        return [a]
    }
    return a.reduce((acc, val) => acc.concat(flatten(val)), [])
}

function is_close(a, b, tol = 1e-9) {
    return Math.abs(a - b) <= tol
}

function is_close_to_int(a, tol = 1e-9) {
    const rounded = Math.round(a);
    return Math.abs(a - rounded) <= tol;
}

function gcd(a, b) {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
        const temp = b
        b = a % b
        a = temp
    }
    return a
}

function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b)
}

function process_index(A, I) {
    if (!Array.isArray(A) && I.length > 0) {
        return "Invalid indices"
    }
    if (I.length === 0) {
        return A
    }
    if (Array.isArray(I[0]) && I[0].length === 2) {
        if ((typeof I[0][0] === "number" || I[0][0] === false) && (typeof I[0][1] === "number" || I[0][1] === false)) { 
            let start = 0
            let end = A.length
            if (I[0][0] !== false) {
                start = I[0][0] - 1
            }
            if (I[0][1] !== false) {
                end = Math.min(A.length, I[0][1])
            }
            let result = []
            for (let r = start; r < end; r++) {
                let ret = process_index(A[r], I.slice(1))
                if (typeof ret === "string") {
                    return ret
                }
                result.push(ret)
            }
            return result
        }
    } else if (!Array.isArray(I[0])) {
        if (I[0] instanceof Operation && I[0].op === ":") {
            let result = []
            for (const row of A) {
                let ret = process_index(row, I.slice(1))
                if (typeof ret === "string") {
                    return ret
                }
                result.push(ret)
            }
            return result
        } else if (typeof I[0] === "number") {
            if (I[0] < 0) {
                return process_index(A[A.length + I[0]], I.slice(1))
            }
            return process_index(A[I[0] - 1], I.slice(1))
        }
    }
    return "Invalid indices"
}

function parse_if(str) {
    try {
        const tokens = str.match(/\bif\b|\bthen\b|\belse\b|[^\s]+/g)
        let index = 0
        function parse_if_expr() {
            if (tokens[index] === "if") {
                index++
                if (index >= tokens.length) {
                    throw "Error: Missing condition after 'if'"
                }
                let condition = []
                while (index < tokens.length && tokens[index] !== "then") {
                    condition.push(tokens[index++])
                }
                if (index >= tokens.length || tokens[index] !== "then") {
                    throw "Error: Missing 'then' after condition"
                }
                if (condition.length === 0) {
                    throw "Error: Empty condition in if expression"
                }
                index++
                if (index >= tokens.length) {
                    throw "Error: Missing expression after 'then'"
                }
                let then_branch = parse_if_expr()
                let else_branch = null
                if (index < tokens.length && tokens[index] === "else") {
                    index++
                    if (index >= tokens.length) {
                        throw "Error: Missing expression after 'else'"
                    }
                    else_branch = parse_if_expr()
                }
                return { 
                    cond: condition.join(" "), 
                    then: then_branch, 
                    else: else_branch 
                }
            } else {
                let expr = []
                while (index < tokens.length && !["if", "then", "else"].includes(tokens[index])) {
                    expr.push(tokens[index++])
                }
                if (expr.length === 0) {
                    throw "Error: Empty conditional expression"
                }
                return expr.join(" ")
            }
        }
        return parse_if_expr()
    } catch (error) {
        return error 
    }
}

function eval_if(if_st, calc) {
    if (typeof if_st === "string") {
        return calc.calculate(if_st, { noAns: true, noRound: true, get_result: true, keep_debug: true })
    }
    const value = calc.calculate(if_st.cond, { noAns: true, get_result: true, keep_debug: true })
    if (value) {
        return eval_if(if_st.then, calc)
    } else {
        return eval_if(if_st.else, calc)
    }
}

function add_fractions(f1, f2) {
    let d = lcm(f1.d, f2.d)
    let n = d / f1.d * f1.n + d / f2.d * f2.n
    return new Fraction(n, d)
}

function subtract_fractions(f1, f2) {
    let d = lcm(f1.d, f2.d)
    let n = d / f1.d * f1.n - d / f2.d * f2.n
    return new Fraction(n, d)
}

function parse_chemical_formula(formula) {
    const elements = {}
    let f = formula.trim()
    while (f.includes("(")) {
        f = f.replace(/\(([^()]+)\)(\d*)/g, (match, group, multiplier) => {
            multiplier = multiplier ? parseInt(multiplier) : 1
            return group.replace(/([A-Z][a-z]*)(\d*)/g, (m, element, count) => {
                count = count ? parseInt(count) * multiplier : multiplier
                return element + count
            })
        })
    }
    const regex = /([A-Z][a-z]*)(\d*)/g
    let match
    let last_index = 0
    while ((match = regex.exec(f)) !== null) {
        if (match.index === regex.lastIndex) {
            regex.lastIndex++
            continue
        }
        const element = match[1]
        const count = match[2] ? parseInt(match[2]) : 1
        elements[element] = (elements[element] || 0) + count
        last_index = regex.lastIndex
    }
    if (last_index < f.length) {
        throw new Error(`Invalid expression '${formula}' in chemistry formula`)
    }
    return elements
}

function parse_chemical_equation(equation) {
    const parts = equation.split(/=|→/).map(s => s.trim())
    if (parts.length !== 2) {
        throw new Error("Chemistry equation must contain exactly one '=' or '→' separator")
    }
    const reactants = parts[0].split("+").map(s => s.trim())
    const products = parts[1].split("+").map(s => s.trim())
    if (reactants.length === 0 || products.length === 0) {
        throw new Error("Chemistry equation must have at least one reactant and one product")
    }
    return {
        reactants: reactants.map(f => ({ parsed: parse_chemical_formula(f), raw: f.replace(/^\d+/, "") })),
        products: products.map(f => ({ parsed: parse_chemical_formula(f), raw: f.replace(/^\d+/, "") }))
    }
}

function find_gcd(numbers) {
    let result = numbers[0]
    for (let i = 1; i < numbers.length; i++) {
        result = gcd(result, numbers[i])
        if (result === 1) return 1
    }
    return result
}

function check_balance(coeffs, matrix, num_elements) {
    for (let i = 0; i < num_elements; i++) {
        let sum = 0
        for (let j = 0; j < coeffs.length; j++) {
            sum += matrix[i][j] * coeffs[j]
        }
        if (sum !== 0) {
            return false
        }
    }
    return true
}

function balance_chemical_equation(equation, max_coefficient = 20) {
    try {
        const { reactants, products } = parse_chemical_equation(equation)
        // console.log("reactants", reactants)
        // console.log("products", products)
        const elements = new Set()
        reactants.forEach(compound => Object.keys(compound.parsed).forEach((e) => elements.add(e)))
        products.forEach(compound => Object.keys(compound.parsed).forEach((e) => elements.add(e)))
        const elements_array = Array.from(elements)
        const matrix = []
        elements_array.forEach(element => {
            const row = []
            reactants.forEach(compound => {
                row.push(-(compound.parsed[element] || 0))
            })
            products.forEach(compound => {
                row.push(compound.parsed[element] || 0)
            })
            matrix.push(row)
        })
        const num_compounds = reactants.length + products.length
        const coeffs = new Array(num_compounds).fill(1)
        let found = false
        let iters = 0
        const generateCombinations = function*(n, max) {
            iters++
            if (iters > 500000) yield [-1]
            if (n === 1) {
                for (let i = 1; i <= max; i++) yield [i]
                return
            }
            for (let i = 1; i <= max; i++) {
                for (const rest of generateCombinations(n - 1, max)) {
                    yield [i, ...rest]
                }
            }
        }
        for (const combination of generateCombinations(num_compounds, max_coefficient)) {
            if (combination.includes(-1)) {
                return `Error: maximum iterations reached > failed to find a solution`
            }
            if (check_balance(combination, matrix, elements_array.length)) {
                found = true
                for (let i = 0; i < num_compounds; i++) {
                    coeffs[i] = combination[i]
                }
                break
            }
        }
        if (!found) {
            return `Error: no solution found with coefficients up to ${max_coefficient}.`
        }
        const gcd_value = find_gcd(coeffs)
        if (gcd_value > 1) {
            for (let i = 0; i < coeffs.length; i++) {
                coeffs[i] /= gcd_value
            }
        }
        const left_side = reactants.map((c, i) => (coeffs[i] !== 1 ? coeffs[i] : "") + c.raw).join(" + ")
        const right_side = products.map((c, i) => (coeffs[reactants.length + i] !== 1 ? coeffs[reactants.length + i] : "") + c.raw).join(" + ")
        return `${left_side} → ${right_side}`
    } catch (error) {
        console.log(error)
        return "Balance chemistry equation error"
    }
}

// Credit to Claude for differentiation code
function differentiate(node, variable) {
    // console.log("differentiate", node, variable)
    if (!node) return null
    if (typeof node.value === "number") {
        return { value: 0 }
    }
    if (typeof node.value === "string") {
        if (node.value === variable) {
            return { value: 1 }
        }
        return { value: 0 }
    }
    switch (node.op) {
        case "+":
        case "-":
            return {
                op: node.op,
                left: differentiate(node.left, variable),
                right: differentiate(node.right, variable)
            }
        case "*":
            return {
                op: "+",
                left: { op: "*", left: differentiate(node.left, variable), right: node.right },
                right: { op: "*", left: node.left, right: differentiate(node.right, variable) }
            }
        case "/":
            return {
                op: "/",
                left: { op: "-", left: { op: "*", left: differentiate(node.left, variable), right: node.right },
                right: { op: "*", left: node.left, right: differentiate(node.right, variable) } }, right: { op: "^", left: node.right, right: { value: 2 } }
            }
        case "^":
            if (typeof node.left?.value === "string" && node.left.value === variable && typeof node.right?.value === "number") {
                const exponent = node.right.value
                return {
                    op: "*",
                    left: { value: exponent },
                    right: { op: "^", left: { value: variable }, right: { value: exponent - 1 } }
                }
            }
            else {
                if (typeof node.left?.value === "number" && typeof node.right?.value === "string" && node.right.value === variable) {
                    return {
                        op: "*",
                        left: { op: "*", left: { op: "ln", arg: node.left }, right: node },
                        right: differentiate(node.right, variable)
                    }
                }
                else {
                    return {
                        op: "*",
                        left: { op: "*", left: node.right, right: { op: "^", left: node.left, right: { op: "-",  left: node.right, right: { value: 1 } } } },
                        right: differentiate(node.left, variable)
                    }
                }
            }
        case "sin":
            return {
                op: "*",
                left: { op: "cos", arg: node.arg },
                right: differentiate(node.arg, variable)
            }
        case "cos":
            return {
                op: "*",
                left: { op: "*", left: { value: -1 }, right: { op: "sin", arg: node.arg } },
                right: differentiate(node.arg, variable)
            }
        case "tan":
            return {
                op: "*",
                left: { op: "^", left: { op: "sec", arg: node.arg }, right: { value: 2 } },
                right: differentiate(node.arg, variable)
            }
        case "cot":
            return {
                op: "*",
                left: { op: "*", left: { value: -1 }, right: { op: "^", left: { op: "csc", arg: node.arg }, right: { value: 2 } } },
                right: differentiate(node.arg, variable)
            }
        case "sec":
            return {
                op: "*",
                left: { op: "*", left: { op: "sec", arg: node.arg }, right: { op: "tan", arg: node.arg } },
                right: differentiate(node.arg, variable)
            }
        case "csc":
            return {
                op: "*",
                left: { op: "*", left: { value: -1 }, right: { op: "*", left: { op: "csc", arg: node.arg }, right: { op: "cot", arg: node.arg } } },
                right: differentiate(node.arg, variable)
            }
        case "exp":
            return {
                op: "*",
                left: { op: "exp", arg: node.arg },
                right: differentiate(node.arg, variable)
            }
        case "ln":
            return {
                op: "*",
                left: { op: "/", left: { value: 1 }, right: node.arg },
                right: differentiate(node.arg, variable)
            }
        default:
            return { value: 0 }
    }
}

function diff_simplify(node) {
    // console.log("diff_simplify", node)
    if (!node) return null
    if (node.left) node.left = diff_simplify(node.left)
    if (node.right) node.right = diff_simplify(node.right)
    if (node.arg) node.arg = diff_simplify(node.arg)
    if ((node.op === "+" || node.op === "-") && is_zero(node.right)) {
        return node.left
    }
    if (node.op === "+" && is_zero(node.left)) {
        return node.right
    }
    if (node.op === "*") {
        if (is_zero(node.left) || is_zero(node.right)) {
            return { value: 0 }
        }
        if (is_one(node.left)) {
            return node.right
        }
        if (is_one(node.right)) {
            return node.left
        }
        if (typeof node.left?.value === "number" && typeof node.right?.value === "string") {
            return { type: "coefficient", coefficient: node.left.value, variable: node.right.value }
        }
    }
    if (node.op === "/" && is_one(node.right)) {
        return node.left
    }
    if (node.op === "^") {
        if (is_zero(node.right)) {
            return { value: 1 }
        }
        if (is_one(node.right)) {
            return node.left
        }
        if (is_zero(node.left)) {
            return { value: 0 }
        }
    }
    if (node.op && node.left && typeof node.left.value === "number" && node.right && typeof node.right.value === "number") {
        const a = node.left.value
        const b = node.right.value
        switch (node.op) {
            case "+": return { value: a + b }
            case "-": return { value: a - b }
            case "*": return { value: a * b }
            case "/": return { value: a / b }
            case "^": return { value: Math.pow(a, b) }
        }
    }
    if ((node.op === "+" || node.op === "-") && node.left?.type === "coefficient" && node.right?.type === "coefficient" && node.left.variable === node.right.variable) {
        const newCoefficient = node.op === "+" ? node.left.coefficient + node.right.coefficient : node.left.coefficient - node.right.coefficient
        return { type: "coefficient", coefficient: newCoefficient,variable: node.left.variable }
    }
    return node
}

function is_zero(node) {
    return node && typeof node.value === "number" && node.value === 0
}

function is_one(node) {
    return node && typeof node.value === "number" && node.value === 1
}

function diff_tree(tokens) {
    // console.log("diff_tree", tokens)
    let index = 0
    function parse_expr() {
        let node = parse_term()
        while (index < tokens.length && ["+", "-"].includes(tokens[index])) {
            const op = tokens[index]
            index++
            node = { op: op, left: node, right: parse_term() }
        }
        return node
    }
    function parse_term() {
        let node = parse_power()
        while (index < tokens.length && (tokens[index] === "*" || tokens[index] === "/")) {
            const op = tokens[index]
            index++
            node = { op: op, left: node, right: parse_power() }
        }
        if (typeof node?.value === "number" && index < tokens.length && typeof tokens[index] === "string" && /^[a-zA-Z]$/.test(tokens[index])) {
            const variable = { value: tokens[index] }
            index++
            return { op: "*", left: node, right: variable }
        }
        return node
    }
    function parse_power() {
        let base = parse_factor()
        if (index < tokens.length && tokens[index] === "^") {
            index++
            if (base && typeof base.value === "string" && base.value === "e") {
                const exponent = parse_factor()
                return { op: "exp", arg: exponent }
            } else {
                const exponent = parse_factor()
                return { op: "^", left: base, right: exponent }
            }
        }
        return base
    }
    function parse_factor() {
        if (index >= tokens.length) return null
        const token = tokens[index]
        if (typeof token === "number") {
            index++
            return { value: token }
        }
        else if (typeof token === "string" && /^[a-zA-Z]$/.test(token)) {
            index++
            return { value: token }
        }
        else if (token.startsWith("(")) {
            index++
            const expr = parse_expr()
            if (tokens[index].startsWith(")")) {
                index++
            }
            return expr
        }
        else if (["sin", "cos", "tan", "sec", "cot", "csc", "ln"].includes(token)) {
            index++
            if (tokens[index].startsWith("(")) {
                index++
                const arg = parse_expr()
                if (tokens[index].startsWith(")")) {
                    index++
                }
                return { op: token, arg: arg }
            }
        }
        return null
    }
    return parse_expr()
}

function diff_natural_simplify(node) {
    // console.log("diff_natural_simplify", node)
    node = diff_simplify(node)
    if (!node) return null
    if (node.op && node.op === "*" && typeof node.left?.value === "number" && typeof node.right?.value === "string") {
        return { type: "coefficient", coefficient: node.left.value, variable: node.right.value }
    }
    if (node.left) node.left = diff_natural_simplify(node.left)
    if (node.right) node.right = diff_natural_simplify(node.right)
    if (node.arg) node.arg = diff_natural_simplify(node.arg)
    if (node.op === "-" && node.right && node.right.op === "-") {
        return node.right.right
    }
    if ((node.op === "sin" || node.op === "cos") && node.arg && node.arg.op === "-") {
        return {
            op: node.op,
            arg: {
                op: "negate",
                arg: node.arg.right
            }
        }
    }
    if (node.op === "*" && node.right && node.right.op === "sin" && 
        node.left && node.left.op === "cos" && 
        node.left.arg && node.left.arg.op === "negate") {
        return {
            op: "*",
            left: node.left,
            right: node.right
        }
    }
    if (node.op === "*" && is_negative_one(node.left)) {
        return {
            op: "negate",
            arg: node.right
        }
    }
    if (node.op === "*" && is_negative_one(node.right)) {
        return {
            op: "negate",
            arg: node.left
        }
    }
    return node
}

function is_negative_one(node) {
    return node && typeof node.value === "number" && node.value === -1
}

function tree_to_string(node) {
    // console.log("tree_to_string", node)
    if (!node) return ""
    if (node.op === "negate") {
        const argStr = tree_to_string(node.arg)
        if (node.arg.op === "+" || node.arg.op === "-") {
            return `-(${argStr})`
        } else {
            return `-${argStr}`
        }
    }
    if (node.type === "coefficient") {
        if (node.coefficient === 1) {
            return node.variable
        } else if (node.coefficient === -1) {
            return `-${node.variable}`
        } else {
            return `${node.coefficient}${node.variable}`
        }
    }
    if (typeof node.value !== "undefined") {
        return node.value.toString()
    }
    let leftStr, rightStr, argStr
    switch (node.op) {
        case "+":
            leftStr = tree_to_string(node.left)
            rightStr = tree_to_string(node.right)
            if (rightStr.startsWith("-")) {
                return `${leftStr} - ${rightStr.substring(1)}`
            }
            return `${leftStr} + ${rightStr}`
        case "-":
            leftStr = tree_to_string(node.left)
            rightStr = tree_to_string(node.right)
            return `${leftStr}${leftStr.length > 0 ? " " : ""}-${leftStr.length > 0 ? " " : ""}${rightStr}`
        case "*":
            leftStr = tree_to_string(node.left)
            rightStr = tree_to_string(node.right)
            if (typeof node.left?.value === "number") {
                const value = node.left.value
                if (value === 1) {
                    return rightStr
                }
                if (value === -1) {
                    if (node.right.op === "+" || node.right.op === "-") {
                        return `-(${rightStr})`
                    } else {
                        return `-${rightStr}`
                    }
                }
                if (typeof node.right?.value === "string") {
                    return `${leftStr}${rightStr}`
                }
            }
            if (node.left?.op === "+" || node.left?.op === "-") {
                leftStr = `(${leftStr})`
            }
            if (node.right?.op === "+" || node.right?.op === "-") {
                rightStr = `(${rightStr})`
            }
            
            return `${leftStr} * ${rightStr}`
        case "/":
            leftStr = tree_to_string(node.left)
            rightStr = tree_to_string(node.right)
            if (node.left?.op) {
                leftStr = `(${leftStr})`
            }
            if (node.right?.op) {
                rightStr = `(${rightStr})`
            }
            return `${leftStr} / ${rightStr}`
        case "^":
            leftStr = tree_to_string(node.left)
            rightStr = tree_to_string(node.right)
            if (node.left?.op) {
                leftStr = `(${leftStr})`
            }
            return `${leftStr}^${rightStr}`
        case "sin":
        case "cos":
        case "exp":
        case "tan":
        case "cot":
        case "sec":
        case "csc":
        case "ln":
            argStr = tree_to_string(node.arg)
            if (node.arg?.op === "negate") {
                const innerArg = tree_to_string(node.arg.arg)
                return `${node.op}(-${innerArg})`
            } else if (argStr.startsWith("- ")) {
                return `${node.op}(-${argStr.substring(2)})`
            }
            return `${node.op}(${argStr})`
        default:
            return ""
    }
}

// Syntax highlight code generated with help from LLMs
function highlightSyntax(element, backticks_mode = false, highlight_types = false) {
    const cursor_position = getCursorPosition(element)
    let text = element.innerHTML.replace(/<span class="highlight-(?:number|word|keyword)">([^<]*)<\/span>/g, "$1")
    const keywords = ["if", "then", "else", "save", "help", "clear", "trace", "to", "plot", "diff", "bal"]
    const types = ["number", "list", "string", "any", "function", "optional", "variable", "unit", "expression"]
    const process_line = (text) => {
        const matches = []
        // Handle complete base numbers (0b101, 0xFF, etc.)
        const complete_base_regex = /(^|\s|>|\(|\[|,|[-+*/%^=:()])(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+)(?!\w)/g
        let match
        while ((match = complete_base_regex.exec(text)) !== null) {
            const prefix = match[1]
            const number = match[2]
            matches.push({
                start: match.index + prefix.length,
                end: match.index + prefix.length + number.length,
                replacement: `<span class="highlight-number">${number}</span>`,
                priority: 1
            })
        }
        // Handle number followed by word (i.e. 12abc)
        const number_var_regex = /(\d+)([a-zA-Z_][a-zA-Z0-9_]*)/g
        while ((match = number_var_regex.exec(text)) !== null) {
            const number = match[1]
            const var_name = match[2]
            if (var_name.length === 1 && ["e", "E"].includes(var_name) && text.substring(match.index + number.length + 1, match.index + number.length + 2).match(/[+\-\d]/)) {
                continue
            }
            const already_matched = matches.some(m => 
                m.start <= match.index && 
                m.end >= match.index + number.length + var_name.length
            )
            if (!already_matched) {
                matches.push({
                    start: match.index,
                    end: match.index + number.length,
                    replacement: `<span class="highlight-number">${number}</span>`,
                    priority: 2
                })
                matches.push({
                    start: match.index + number.length,
                    end: match.index + number.length + var_name.length,
                    replacement: `<span class="highlight-word">${var_name}</span>`,
                    priority: 2.5
                })
            }
        }
        // Handle base prefixes without proper digits
        const base_prefix_regex = /(^|\s|>|\(|\[|,|[-+*/%^=()])(0x|0b|0o)(?!\w)/g
        while ((match = base_prefix_regex.exec(text)) !== null) {
            const prefix = match[1]
            const basePrefix = match[2]
            const already_matched = matches.some(m => 
                m.start <= match.index + prefix.length && 
                m.end >= match.index + match[0].length
            )
            if (!already_matched) {
                matches.push({
                    start: match.index + prefix.length,
                    end: match.index + match[0].length,
                    replacement: `<span class="highlight-number">${basePrefix}</span>`,
                    priority: 3
                })
            }
        }
        // Handle decimal numbers
        const decimal_regex = /(^|\s|[><=+\-*/%^&|:(),\[\]])(-?\d+\.?\d*(?:[eE][+\-]?\d+)?|\.\d+(?:[eE][+\-]?\d+)?)(?![a-zA-Z0-9_])/g
        while ((match = decimal_regex.exec(text)) !== null) {
            const prefix = match[1]
            const number = match[2]
            const already_matched = matches.some(m => 
                m.start <= match.index + prefix.length && 
                m.end >= match.index + prefix.length + number.length
            )
            if (!already_matched) {
                matches.push({
                    start: match.index + prefix.length,
                    end: match.index + prefix.length + number.length,
                    replacement: `<span class="highlight-number">${number}</span>`,
                    priority: 4
                })
            }
        }
        // Handle words
        const word_regex = /(^|\s|>|\(|\[|,|[-+*/%^=:.()])([a-zA-Z_][a-zA-Z0-9_]*)(?![^<]*>)/g
        while ((match = word_regex.exec(text)) !== null) {
            const prefix = match[1]
            const word = match[2]
            if (!keywords.includes(word) && (!highlight_types || !types.includes(word))) {
                const already_matched = matches.some(m => 
                    (m.start <= match.index + prefix.length && 
                    m.end >= match.index + match[0].length) ||
                    matches.some(nm => nm.end === match.index + prefix.length)
                )
                if (!already_matched) {
                    matches.push({
                        start: match.index + prefix.length,
                        end: match.index + prefix.length + word.length,
                        replacement: `<span class="highlight-word">${word}</span>`,
                        priority: 5
                    })
                }
            }
        }
        // Handle keywords
        const keyword_regex = new RegExp(`(^|\\s|>|\\(|\\[)(${keywords.join("|")})(?=$|\\s|\\W|\\)|>|\\])`, "g")
        while ((match = keyword_regex.exec(text)) !== null) {
            const prefix = match[1]
            const keyword = match[2]
            matches.push({
                start: match.index + prefix.length,
                end: match.index + prefix.length + keyword.length,
                replacement: `<span class="highlight-keyword">${keyword}</span>`,
                priority: 6
            })
        }
        if (highlight_types) {
            for (const type_name of types) {
                const type_regex = new RegExp(`(^|\\s|>|\\(|\\[)(${type_name})(?=$|\\s|\\W|\\)|>|\\])`, "g")
                while ((match = type_regex.exec(text)) !== null) {
                    const prefix = match[1]
                    const keyword = match[2]
                    matches.push({
                        start: match.index + prefix.length,
                        end: match.index + prefix.length + keyword.length,
                        replacement: `<span class="highlight-type-${type_name.toLowerCase()}">${keyword}</span>`,
                        priority: 6
                    })
                }
            }
        }
        // Resolve match overlaps in order of priority
        matches.sort((a, b) => {
            if (a.start !== b.start) return a.start - b.start
            return a.priority - b.priority
        })
        
        let result = ""
        let lastIndex = 0
        const final_matches = []
        for (let i = 0; i < matches.length; i++) {
            const current = matches[i]
            const overlaps = final_matches.some(m => 
                (current.start < m.end && current.end > m.start)
            )
            if (!overlaps) {
                final_matches.push(current)
            }
        }
        final_matches.sort((a, b) => a.start - b.start)
        for (const match of final_matches) {
            result += text.substring(lastIndex, match.start)
            result += match.replacement
            lastIndex = match.end
        }
        result += text.substring(lastIndex)
        return result
    }
    if (backticks_mode) {
        text = text.replace(/`([^`]+)`/g, (match, content) => process_line(content))
    } else {
        text = text.split("\n").map(process_line).join("\n")
    }
    if (element.innerHTML !== text) {
        element.innerHTML = text
        setCursorPosition(element, cursor_position)
    }
}

function getCursorPosition(element, start_node = null, start_offset = null) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return 0
    const range = selection.getRangeAt(0)
    const new_range = range.cloneRange()
    new_range.selectNodeContents(element)
    if (start_node && start_offset !== null) {
        new_range.setEnd(start_node, start_offset)
    } else {
        new_range.setEnd(range.endContainer, range.endOffset)
    }
    return new_range.toString().length
}
  
function setCursorPosition(element, position) {
    if (!document.contains(element)) return
    const node_info = find_node_and_offset_position(element, position)
    if (!node_info) return
    const { node, offset } = node_info
    const range = document.createRange()
    range.setStart(node, offset)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
}
  
function find_node_and_offset_position(root_node, target_position) {
    let current_position = 0
    function find_position(node) {
        if (node.nodeType === Node.TEXT_NODE) {
        const node_length = node.nodeValue.length
        if (current_position <= target_position && target_position <= current_position + node_length) {
            return {
            node: node,
            offset: target_position - current_position
            }
        }
        current_position += node_length
        } 
        else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
            const result = find_position(node.childNodes[i])
            if (result) return result
        }
        }
        return null
    }
    return find_position(root_node)
}