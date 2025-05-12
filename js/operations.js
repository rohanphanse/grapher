// Units
const UNIT_NAMES = { "km": "Kilometer", "me": "Meter", "cm": "Centimeter", "mm": "Millimeter", "um": "Micrometer", "nm": "Nanometer", "ft": "Foot", "mi": "Mile", "kg": "Kilogram", "gm": "Gram", "mg": "Milligram", "lb": "Pound", "oz": "Ounce", "se": "Second", "mn": "Minute", "hr": "Hour", "ms": "Millisecond", "day": "Day", "yr": "Year", "ly": "Light Year", "wk": "Week", "jl": "Joule", "cal": "Calorie", "kcal": "Kilocalorie", "au": "Astronomical Unit", "kj": "Kilojoule", "ev": "Electron Volt", "li": "Liter", "gal": "Gallon", "ml": "Milliiter", "in": "Inch", "kel": "Kelvin", "cel": "Celcius", "far": "Fahrenheit", "cu": "Coulomb", "fa": "Farad", "ne": "Newton", "am": "Ampere", "wa": "Watt", "pa": "Pascal", "wb": "Weber", "te": "Tesla", "he": "Henry", "om": "Ohm", "vo": "Volt", "atm": "Standard atmosphere", "mol": "Mole" }
const UNITS = Object.keys(UNIT_NAMES)
const TEMP_UNITS = ["far", "cel", "kel"]
const FROM_UNITS = {
    "km": 1000,
    "me": 1,
    "cm": 0.01,
    "mm": 0.001,
    "um": 0.000001,
    "nm": 0.000000001,
    "ft": 0.3048,
    "mi": 1609.34,
    "kg": 1,
    "gm": 0.001,
    "mg": 0.000001,
    "lb": 0.453592,
    "oz": 0.0283495,
    "se": 1,
    "mn": 60,
    "hr": 3600,
    "ms": 0.001,
    "day": 86400, 
    "yr": 31556952,
    "ly": 9.461e+15,
    "wk": 604800,
    "jl": 1,
    "cal": 4.184,
    "kcal": 4184,
    "au": 1.496e+11,
    "kj": 1000,
    "ev": 1.60218e-19,
    "li": 0.001,
    "gal": 0.00378541,
    "ml": 0.000001,
    "in": 0.0254,
    "kel": { from: (x) => x - 273.15, to: (x) => x + 273.15 },
    "cel": { from: (x) => x, to: (x) => x },
    "far": { from: (x) => (x - 32) * 5/9, to: (x) => x * 9/5 + 32 },
    "cu": 1,
    "fa": 1,
    "ne": 1,
    "am": 1,
    "wa": 1,
    "pa": 1,
    "om": 1,
    "vo": 1,
    "wb": 1,
    "he": 1,
    "te": 1,
    "atm": 101325,
    "mol": 1
}
const TO_UNITS = {}
for (const u in FROM_UNITS) {
    if (typeof FROM_UNITS[u] === "number") {
        TO_UNITS[u] = 1 / FROM_UNITS[u]
    }
}
const UNIT_GROUPS = [
    ["km", "me", "cm", "mm", "um", "nm", "mi", "ft", "in", "au", "ly"], 
    ["kg", "gm", "mg", "lb", "oz"], 
    ["se", "ms", "mn", "hr", "day", "wk", "yr"], ["jl", "kj", "cal", "kcal", "ev"], 
    ["li" , "ml", "gal"], ["kel", "cel", "far"], ["cu"], 
    ["fa"], 
    ["ne"],
    ["am"],
    ["wa"],
    ["pa", "atm"],
    ["om"],
    ["vo"],
    ["wb"],
    ["te"],
    ["he"],
    ["mol"]
]
const SI_EXPANSIONS = {
    "ne": { "kg": 1, "me": 1, "se": -2 },
    "jl": { "kg": 1, "me": 2, "se": -2 },
    "wa": { "kg": 1, "me": 2, "se": -3 },
    "pa": { "kg": 1, "me": -1, "se": -2 },
    "cu": { "am": 1, "se": 1 },
    "fa": { "kg": -1, "me": -2, "se": 4, "am": 2 },
    "om": { "kg": 1, "me": 2, "se": -3, "am": -2 },
    "vo": { "kg": 1, "me": 2, "se": -3, "am": -1 },
    "wb": { "kg": 1, "me": 2, "se": -2, "am": -1},
    "te": { "kg": 1, "se": -2, "am": -1 },
    "he": { "kg": 1, "me": 2, "se": -2, "am": -2 },
    "li": { "me": 3 },

}
// Order of operations
const ORDER_OF_OPERATIONS = [
    ["^"],
    UNITS,
    ["to"],
    ["!", "mod"],         // Exponentiation and modulus
    ["choose", "perm", "cross"],
    ["/", "*"],         // Division then multiplication
    ["-"],        // Sutraction, negation, and then addition
    ["+"],
    ["si"],
    [":"],
    ["==", "!=", "<", ">", ">=", "<="],
    ["not"],
    ["and"],
    ["or"],
    ["~", "&", "|", "xor"],
    ["<<", ">>"],
]

// Subsets
const CONSTANTS = ["pi", "e", "phi", "inf", "true", "false", "hh", "cc", "qe", "u0", "e0", "mel", "mp", "gg", "ge", "rr", "na", "mH", "mHe", "mLi", "mBe", "mB", "mC", "mN", "mO", "mF", "mNe", "mNa", "mMg", "mAl", "mSi", "mP", "mS", "mCl", "mAr", "mK", "mCa", "mTi", "mCr", "mMn", "mFe", "mCo", "mNi", "mCu", "mZn", "mAg", "mAu", "mHg", "mPb", "mU"]
const SYMBOLS = ["+", "-", "*", "/", "^", "!", "<<", ">>", "&", "|", "~", "xor", "choose", "perm", "to", ...UNITS, ":", "cross", "==", "!=", ">", ">=", "<", "<=", "and", "or", "not", "mod", "si"]
const ANGLE_FUNCTIONS = ["sin", "cos", "tan", "csc", "sec", "cot"]
const ANGLE_INVERSE_FUNCTIONS = ["arcsin", "arccos", "arctan"]
const KEYWORDS = ["ans", "clear", "help", "save", "if", "then", "else", "trace", "plot", "bal"]
const LIST_OPERATIONS = ["mean", "median", "sd", "sort", "sum", "len", "max", "min", "concat", "zeros"]

// Types
const TN = "number"
const TS = "string"
const TOR = (t1, t2) => `${t1} | ${t2}`
const TL = (t) => `list[${t}]`
const TA = "any"
const TF = "function"
const TO = (t) => `optional[${t}]`
const TI = "invalid"
const TU = "unit"
const TB = "bool"
const bases = { "0b": 2, "0x": 16, "0o": 8 }

// Operations
const OPERATIONS = {
    "+": {
        name: "Addition",
        func: (a, b) => {  
            param_types = get_param_types([a, b]) 
            if (param_types[0] == TN && param_types[1] == TN) {
                if (a instanceof Fraction && b instanceof Fraction) {
                    return add_fractions(a, b)
                } else if (a instanceof Fraction && Number.isInteger(b)) {
                    return add_fractions(a, new Fraction(b, 1))
                } else if (b instanceof Fraction && Number.isInteger(a)) {
                    return add_fractions(new Fraction(a, 1), b)
                } else if (a instanceof UnitNumber && b instanceof UnitNumber) {
                    if (UnitNumber.same_units(a.unit, b.unit)) {
                        return new UnitNumber(a.value() + b.value(), a.unit)
                    }
                    const a_keys = Object.keys(a.unit)
                    const b_keys = Object.keys(b.unit)
                    if (a_keys.length === 1 && b_keys.length === 1 && a.unit[a_keys[0]] === 1 && b.unit[b_keys[0]] === 1) {
                        const a_unit = a_keys[0]
                        const b_unit = b_keys[0]
                        const b_converted_value = convert_to_unit(b.value(), b_unit, a_unit)
                        return new UnitNumber(a.value() + b_converted_value, { [a_unit]: 1 })
                    } else {
                        return "Cannot add units"
                    }
                } else if (a instanceof UnitNumber) {
                    if (typeof b === "number") {
                        return new UnitNumber(a.value() + b, a.unit)
                    } else {
                        return new UnitNumber(a.value() + b.value(), a.unit)
                    }
                } else if (b instanceof UnitNumber) {
                    if (typeof a === "number") {
                        return new UnitNumber(b.value() + a, b.unit) 
                    } else {
                        return new UnitNumber(b.value() + a.value(), b.unit)
                    }
                }
                if (a instanceof Fraction) {
                    a = a.value()
                }
                if (b instanceof Fraction) {
                    b = b.value()
                }
                return a + b
            } else if (param_types[0].startsWith("list") && param_types[1].startsWith("list") && param_types[0] == param_types[1]) {
                return add_tensors(a, b)
            } else if (param_types[0] == "number" && param_types[1].startsWith("list")) {
                return tensor_add_scalar(b, a)
            } else if (param_types[1] == "number" && param_types[0].startsWith("list")) {
                return tensor_add_scalar(a, b)
            } else {
                return "Invalid types"
            }
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TOR(TN, TL(TA)), TOR(TN, TL(TA))],
        example: "Examples:\n  1. Add numbers: \`2 + 2 -> 4\`\n  2. Add tensors: \`[[[1, 2]]] + [[[2, 1]]] -> [[[3, 3]]]\`\n  3. Add numbers and tensors: \`2 + [1, 2] -> [3, 4]\`",
        allow_fractions: true,
        allow_units: true
    },
    "-": {
        name: "Subtraction",
        func: (a, b) => {
            param_types = get_param_types([a, b])
            if (param_types[0] == TN && param_types[1] == TN) {
                if (a instanceof Fraction && b instanceof Fraction) {
                    return subtract_fractions(a, b)
                } else if (a instanceof Fraction && Number.isInteger(b)) {
                    return subtract_fractions(a, new Fraction(b, 1))
                } else if (b instanceof Fraction && Number.isInteger(a)) {
                    return subtract_fractions(new Fraction(a, 1), b)
                } else if (a instanceof UnitNumber && b instanceof UnitNumber) {
                    if (UnitNumber.same_units(a.unit, b.unit)) {
                        return new UnitNumber(a.value() - b.value(), a.unit)
                    }
                    const a_keys = Object.keys(a.unit)
                    const b_keys = Object.keys(b.unit)
                    if (a_keys.length === 1 && b_keys.length === 1 && a.unit[a_keys[0]] === 1 && b.unit[b_keys[0]] === 1) {
                        const a_unit = a_keys[0]
                        const b_unit = b_keys[0]
                        const b_converted_value = convert_to_unit(b.value(), b_unit, a_unit)
                        return new UnitNumber(a.value() - b_converted_value, { [a_unit]: 1 })
                    } else {
                        return "Cannot subtract units"
                    }
                } else if (a instanceof UnitNumber) {
                    if (typeof b === "number") {
                        return new UnitNumber(a.value() - b, a.unit)
                    } else {
                        return new UnitNumber(a.value() - b.value(), a.unit)
                    }
                } else if (b instanceof UnitNumber) {
                    if (typeof a === "number") {
                        return new UnitNumber(a - b.value(), b.unit) 
                    } else {
                        return new UnitNumber(a.value() - b.value(), b.unit)
                    }
                }
                if (a instanceof Fraction) {
                    a = a.value()
                }
                if (b instanceof Fraction) {
                    b = b.value()
                }
                return a - b
            } else if (param_types[0].startsWith("list") && param_types[1].startsWith("list") && param_types[0] == param_types[1]) {
                return add_tensors(a, b, -1)
            } else if (param_types[0] == "number" && param_types[1].startsWith("list")) {
                return tensor_add_scalar(b, a, -1)
            } else if (param_types[1] == "number" && param_types[0].startsWith("list")) {
                return tensor_add_scalar(a, -b)
            } else {
                return "Invalid types"
            }
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TOR(TN, TL(TA)), TOR(TN, TL(TA))],
        allow_fractions: true,
        allow_units: true,
        
    },
    "neg": {
        name: "Negation",
        func: (n) => {
            param_type = get_param_types([n])[0]
            if (param_type == TN) {
                if (n instanceof Fraction) {
                    let copy = new Fraction(n.n, n.d)
                    copy.neg = !n.neg
                    return copy
                }
                return -n
            } else if (param_type.startsWith("list")) {
                return add_tensors(n, n, -1, 0)
            } else {
                return "Invalid types"
            }
        },
        schema: [1],
        vars: ["x"],
        types: [TOR(TN, TL(TA))],
        allow_fractions: true,
    },
    "*": {
        name: "Multiplication",
        func: (a, b) => {
            param_types = get_param_types([a, b])
            if (param_types[0] == TN && param_types[1] == TN) {
                if (a instanceof Fraction && b instanceof Fraction) {
                    return new Fraction(a.n * b.n, a.d * b.d)
                } else if (a instanceof Fraction && Number.isInteger(b)) {
                    return new Fraction(a.n * b, a.d)
                } else if (b instanceof Fraction && Number.isInteger(a)) {
                    return new Fraction(b.n * a, b.d)
                } else if (a instanceof UnitNumber && b instanceof UnitNumber) {
                    return new UnitNumber(a.value() * b.value(), UnitNumber.multiply_units(a.unit, b.unit))
                } else if (a instanceof UnitNumber) {
                    if (typeof b === "number") {
                        return new UnitNumber(a.value() * b, a.unit)
                    } else {
                        return new UnitNumber(a.value() * b.value(), a.unit)
                    }
                } else if (b instanceof UnitNumber) {
                    if (typeof a === "number") {
                        return new UnitNumber(a * b.value(), b.unit) 
                    } else {
                        return new UnitNumber(a.value() * b.value(), b.unit)
                    }
                }
                return a * b
            } else if (param_types[0] == TL(TN) && param_types[1] == TL(TN)) {
                if (a.length !== b.length) {
                    return "Dot product error > vectors must be the same size"
                }
                let dot_product = 0
                for (let i = 0; i < a.length; i++) {
                    dot_product += a[i] * b[i]
                }
                return dot_product
            } else if (a instanceof Fraction && b instanceof Operation && UNITS.includes(b.op)) {
                return new UnitNumber(a.value(), { [b.op]: 1 })
            } else if (a instanceof Operation && UNITS.includes(a.op) && b instanceof Operation && UNITS.includes(b.op)) {
                const new_unit = UnitNumber.multiply_units({ [a.op]: 1 }, { [b.op]: 1 })
                return new UnitNumber(1, new_unit)
            } else if (a instanceof UnitNumber && b instanceof Operation && UNITS.includes(b.op)) {
                const new_unit = UnitNumber.multiply_units(a.unit, { [b.op]: 1 })
                return new UnitNumber(a.value(), new_unit)
            } else if (typeof a === "number" && b instanceof Operation && UNITS.includes(b.op)) {
                return new UnitNumber(a, { [b.op]: 1 })
            } else if (typeof b === "number" && a instanceof Operation && UNITS.includes(a.op)) {
                return new UnitNumber(b, { [a.op]: 1 })
            } else if (param_types[0] == TL(TL(TN)) && param_types[1] == TL(TL(TN))) {
                return matmul(a, b)
            } else if (param_types[0] == TN && param_types[1] == TL(TL(TN))) {
                return matmul_scalar(b, a)
            } else if (param_types[1] == TN && param_types[0] == TL(TL(TN))) {
                return matmul_scalar(a, b)
            } else if (param_types[0] == TN && param_types[1] == TL(TN)) {
                return matmul_scalar([b], a)[0]
            } else if (param_types[1] == TN && param_types[0] == TL(TN)) {
                return matmul_scalar([a], b)[0]
            }
            return "Invalid types"
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TOR(TOR(TN, TOR(TL(TN), TL(TL(TN)))), TU), TOR(TOR(TN, TOR(TL(TN), TL(TL(TN)))), TU)],
        example: "Examples:\n  1. Multiply numbers: \`2 * 2 -> 4\`\n  2. Dot product: \`[1, 2] * [3, 4] -> 11\`\n  3. Matrix multiplication:\n     \`[[1, 2], [3, 4]] * [[1, 1], [1, 1]] -> [[3, 3], [7, 7]]\`",
        allow_fractions: true,
        allow_units: true,
    },
    "/": {
        name: "Division",
        func: (a, b) => {
            if (Number.isInteger(a) && Number.isInteger(b)) {
                return new Fraction(a, b)
            } else if (a instanceof Fraction && b instanceof Fraction) {
                return new Fraction(a.n * b.d, a.d * b.n)
            } else if (a instanceof Fraction && Number.isInteger(b)) {
                return new Fraction(a.n, b * a.d)
            } else if (b instanceof Fraction && Number.isInteger(a)) {
                return new Fraction(a * b.d, b.n)
            } else if (a instanceof Operation && UNITS.includes(a.op) && b instanceof Operation && UNITS.includes(b.op)) {
                a = new UnitNumber(1, { [a.op]: 1 })
                const new_unit = UnitNumber.divide_units(a.unit, { [b.op]: 1 })
                return new UnitNumber(a.value(), new_unit)
            } else if (a instanceof UnitNumber && b instanceof Operation && UNITS.includes(b.op)) {
                const new_unit = UnitNumber.divide_units(a.unit, { [b.op]: 1 })
                return new UnitNumber(a.value(), new_unit)
            } else if (b instanceof UnitNumber && a instanceof Operation && UNITS.includes(a.op)) {
                const new_unit = UnitNumber.divide_units({ [a.op]: 1 }, b.unit)
                return new UnitNumber(1 / b.value(), new_unit)
            } else if (a instanceof UnitNumber && b instanceof UnitNumber) {

                return new UnitNumber(a.value() / b.value(), UnitNumber.divide_units(a.unit, b.unit))
            } else if (a instanceof UnitNumber) {
                if (typeof b === "number") {
                    return new UnitNumber(a.value() / b, a.unit)
                } else {
                    return new UnitNumber(a.value() / b.value(), a.unit)
                }
            } else if (b instanceof UnitNumber) {
                if (typeof a === "number") {
                    return new UnitNumber(a / b.value(), UnitNumber.divide_units({}, b.unit))
                } else {
                    return new UnitNumber(a.value() / b.value(), UnitNumber.divide_units({}, b.unit))
                }
            } else if (b instanceof Operation && UNITS.includes(b.op)) {
                if (typeof a === "number") {
                    return new UnitNumber(a, UnitNumber.divide_units({}, { [b.op]: 1 }))
                } else {
                    return new UnitNumber(a.value(), UnitNumber.divide_units({}, { [b.op]: 1 }))
                }
            }
            return a / b
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TOR(TN, TU), TOR(TN, TU)],
        allow_fractions: true,
        allow_units: true
    },
    "^": {
        name: "Exponentiation",
        func: (a, b) => {
            if (UNITS.includes(a) && typeof b === "number") {
                return new UnitNumber(1, UnitNumber.pow_unit({ [a]: 1 }, b))
            } else if (a instanceof UnitNumber) {
                if (typeof b === "number") {
                    return new UnitNumber(a.value() ** b, UnitNumber.pow_unit(a.unit, b));
                } else {
                    return new UnitNumber(a.value() ** b.value(), UnitNumber.pow_unit(a.unit, b.value()));
                }
            } else if (b instanceof UnitNumber) {
                if (typeof a === "number") {
                    return new UnitNumber(a ** b.value(), UnitNumber.pow_unit(b.unit, b.value()))
                } else {
                    return new UnitNumber(a.value() ** b.value(), UnitNumber.pow_unit(b.unit, b.value()))
                }
            }
            return a ** b
        },
        schema: [-1, 1],
        vars: ["base", "exponent"],
        types: [TOR(TN, TU), TN],
        allow_units: true
    },
    "!": {
        name: "Factorial",
        func: (n) => factorial(n),
        schema: [-1],
        vars: ["x"],
        types: [TN]
    },
    "mod": {
        name: "Modulus",
        func: (a, b) => a % b,
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    "&": {
        name: "Bitwise and",
        func: (a, b) => a & b,
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    "|": {
        name: "Bitwise or",
        func: (a, b) => a | b,
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    "~": {
        name: "Bitwise negation",
        func: (n) => ~n,
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "xor": {
        name: "Bitwise exclusive or",
        func: (a, b) => a ^ b,
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    ">>": {
        name: "Right shift",
        func: (a, b) => a >> b,
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    "<<": {
        name: "Left shift",
        func: (a, b) => a << b,
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    "round": {
        name: "Round",
        func: (n, p = 0) => Math.round(n * 10 ** p) / (10 ** p),
        schema: [1],
        vars: ["x", "precision"],
        types: [TN, TO(TN)]
    },
    "floor": {
        name: "Floor",
        func: (n) => Math.floor(n),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "ceil": {
        name: "Ceiling",
        func: (n) => Math.ceil(n),
        schema: [1],
        vars: ["number"],
        types: [TN]
    },
    "pi": {
        name: "Pi",
        func: () => Math.PI,
        schema: [],
        vars: [],
        types: [],
    },
    "e": {
        name: "Euler's number",
        func: () => Math.E,
        schema: [],
        vars: [],
        types: [],
    },
    "phi": {
        name: "Phi",
        func: () => (1 + Math.sqrt(5)) / 2,
        schema: [],
        vars: [],
        types: []
    },
    "inf": {
        name: "Infinity",
        func: () => Infinity,
        schema: [],
        vars: [],
        types: []
    },
    "log": {
        name: "Logarithm",
        func: (b, x) => {
            if (x) {
                return Math.log(x) / Math.log(b)
            } else {
                return Math.log(b) / Math.log(10)
            }
        },
        schema: [1],
        vars: ["base", "x"],
        types: [TN, TO(TN)]
    },
    "ln": {
        name: "Natural Logarithm",
        func: (x) => Math.log(x),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "sin": {
        name: "Sine",
        func: (theta) => {
            if (is_close(theta, Math.PI / 6)) {
                return new Fraction(1, 2)
            }
            if (is_close(theta, Math.PI)) {
                return 0
            }
            return Math.sin(theta)
        },
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "cos": {
        name: "Cosine",
        func: (theta) => {
            if (is_close(theta, Math.PI / 3)) {
                return new Fraction(1, 2)
            }
            if (is_close(theta, Math.PI / 2)) {
                return 0
            }
            return Math.cos(theta)
        },
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "tan": {
        name: "Tangent",
        func: (theta) => {
            if (is_close_to_int(theta / Math.PI)) {
                return 0
            }
            return Math.tan(theta)
        },
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "csc": {
        name: "Cosecant",
        func: (theta) => 1 / Math.sin(theta),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "sec": {
        name: "Secant",
        func: (theta) => 1 / Math.cos(theta),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "cot": {
        name: "Cotangent",
        func: (theta) => 1 / Math.tan(theta),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "arcsin": {
        name: "Inverse sine",
        func: (theta) => {
            return Math.asin(theta)
        },
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "arccos": {
        name: "Inverse cosine",
        func: (theta) => Math.acos(theta),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "arctan": {
        name: "Inverse tangent",
        func: (theta) => Math.atan(theta),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "abs": {
        name: "Absolute value",
        func: (n) => Math.abs(n),
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "min": {
        name: "Minimum",
        func: (nums) => Math.min(...nums),
        schema: [1],
        vars: ["x"],
        types: [TL(TN)]
    },
    "max": {
        name: "Maximum",
        func: (nums) => Math.max(...nums),
        schema: [1],
        vars: ["x"],
        types: [TL(TN)]
    },
    "sqrt": {
        name: "Square root",
        func: (n) => {
            if (typeof n == "number") {
                return Math.sqrt(n)
            } else if (n instanceof UnitNumber) {
                const new_units = {}
                for (const u in n.unit) {
                    new_units[u] = n.unit[u] / 2;
                }
                return new UnitNumber(value, new_units)
            }
        },
        schema: [1],
        vars: ["x"],
        types: [TN],
        allow_units: true
    },
    "sum": {
        name: "Sum",
        func: (nums) => nums.reduce((a, b) => a + b),
        schema: [1],
        vars: ["x"],
        types: [TL(TN)]
    },
    "mean": {
        name: "Mean",
        func: (nums) => mean(nums),
        schema: [1],
        vars: ["x"],
        types: [TL(TN)]
    },
    "median": {
        name: "Median",
        func: (nums) => {
            if (nums.length > 1) {
                nums = [...nums].sort((a, b) => a - b)
                if (nums.length % 2 === 0) {
                    return (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2
                } else {
                    return nums[Math.floor(nums.length / 2)]
                }
            } else {
                return nums[0]
            }
        },
        schema: [1],
        vars: ["x"],
        types: [TL(TN)]
    },
    "sd": {
        name: "Standard deviation",
        func: (nums) => {
            const m = mean(nums)
            return Math.sqrt(mean(nums.map((n) => {
                return (n - m) ** 2
            })))
        },
        schema: [1],
        vars: ["x"],
        types: [TL(TN)]
    },
    "sort": {
        name: "Sort",
        func: (nums) => {
            return [...nums].sort((a, b) => a - b)
        },
        schema: [1],
        vars: ["x"],
        types: [TL(TN)],
    },
    "bin": {
        name: "Decimal to binary",
        func: (n) => {
            if (isInt32(n)) {
                return new BaseNumber("0b" + (n >>> 0).toString(2))
            }
            return new BaseNumber("0b" + n.toString(2))
        },
        schema: [1],
        vars: ["x"],
        types: [TN]
    },
    "hex": {
        name: "Decimal to hexadecimal",
        func: (n) => {
            if (isInt32(n)) {
                return new BaseNumber("0x" + (n >>> 0).toString(16))
            }
            return new BaseNumber("0x" + n.toString(16))
        },
        schema: [1],
        vars: ["number"],
        vars: ["x"],
        types: [TN]
    },
    "oct": {
        name: "Decimal to octal",
        func: (n) => {
            if (isInt32(n)) {
                return new BaseNumber("0o" + (n >>> 0).toString(8))
            }
            return new BaseNumber("0o" + n.toString(8))
        },
        schema: [1],
        vars: ["number"],
        vars: ["x"],
        types: [TN]
    },
    "dec": {
        name: "Convert to decimal",
        func: (n, radix = 10) => convert_to_decimal(n, radix),
        schema: [1],
        vars: ["x", "radix"],
        types: [TN, TO(TN)],
        allow_base_numbers: true,
    },
    "quad": {
        name: "Solve quadratic in form of f(x) = ax^2 + bx + c = 0",
        func: (f, calc) => {
            const p = calc.functions[f.op].parameters
            const v = calc.functions[f.op].value
            if (p.length !== 1) {
                return `Expected ${f.op} to have only one parameter`
            } 
            const x = p[0]
            const eq = v.join("")
            const eq_x = eq.replaceAll(x, "x")
            const match = eq_x.match(/([+-]?\d*)x\^2(?:([+-]?\d*)x)?([+-]?\d*)?/)
            if (match) {
                const a = parseFloat(match[1] || "1")
                const b = parseFloat(match[2] || "0")
                const c = parseFloat(match[3] || "0")
                const result = solve_quadratic(a, b, c).map((x) => round(x, calc.digits))
                if (result.includes(NaN)) {
                    return "Invalid format error"
                }
                let b_part = b == 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}${x}`
                let c_part = c == 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`
                let response = `\`${a == 1 ? "" : a}${x}^2${b_part}${c_part} = 0\`\n\Roots: `
                if (result.length === 2) {
                    response += `\`${x} = ${result[0]}\` or \`${x} = ${result[1]}\``
                } else if (result.length === 1) {
                    response += `\`${x} = ${result[0]}\``
                } else {
                    response += "No real solutions"
                }
                return new String(response)
            } else {
                return "Invalid format error"
            }
        }, 
        schema: [1],
        vars: ["f"],
        types: [TF],
        calc: true
    },
    "cubic": {
        name: "Solve cubic in form of f(x) = ax^3 + bx^2 + cx + d = 0",
        func: (f, calc) => {
            const p = calc.functions[f.op].parameters
            const v = calc.functions[f.op].value
            if (p.length !== 1) {
                return `Expected ${f.op} to have only one parameter`
            } 
            const x = p[0]
            const eq = v.join("")
            const eq_x = eq.replaceAll(x, "x")
            const match = eq_x.match(/([+-]?\d*)x\^3(?:\s*([+-]?\d*)x\^2)?(?:\s*([+-]?\d*)x)?(?:\s*([+-]?\d+))?/)
            if (match) {
                const a = parseCoefficient(match[1])
                const b = parseCoefficient(match[2])
                const c = parseCoefficient(match[3])
                const d = parseFloat(match[4] || "0")
                const result = solve_cubic(a, b, c, d).map((x) => round(x, calc.digits))
                if (result.includes(NaN)) {
                    return "Invalid format error"
                }
                let b_part = b == 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}${x}^2`
                let c_part = c == 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}${x}`
                let d_part = d == 0 ? "" : ` ${d < 0 ? "-" : "+"} ${Math.abs(d)}`
                let response = `\`${a == 1 ? "" : a}${x}^3${b_part}${c_part}${d_part} = 0\`\nRoots: `
                if (result.length === 3) {
                    response += `\`${x} = ${result[0]}\` or \`${x} = ${result[1]}\` or \`${x} = ${result[2]}\``
                } else if (result.length === 2) {
                    response += `\`${x} = ${result[0]}\` or \`${x} = ${result[1]}\``
                } else if (result.length === 1) {
                    response += `\`${x} = ${result[0]}\``
                } else {
                    response += "No real solutions"
                }
                return new String(response)
            } else {
                return "Invalid format error"
            }
        }, 
        schema: [1],
        vars: ["f"],
        types: [TF],
        calc: true
    },
    "range": {
        name: "Range",
        func: (a, b, step = 1) => {
            let range = []
            if (!b) {
                b = a
                a = 1
            }
            for (let n = a; n <= b; n += step) {
                range.push(n)
            }
            return range
        },
        schema: [1],
        vars: ["start", "end", "step"],
        types: [TN, TO(TN), TO(TN)],
        example: "Examples:\n  1. \`range(5) -> [1, 2, 3, 4, 5]\`\n  2. \`range(3, 5) -> [3, 4, 5]\`\n  3. \`range(3, 5, 0.5) -> [3, 3.5, 4, 4.5, 5]\`"
    },
    "map": {
        name: "Map",
        func: (list, func, calc) => {
            let output = []
            for (const e of list) {
                let tokens = [func.op, new Paren([e])]
                let result = calc.evaluate(tokens, { noAns: true, noRound: true })
                if (typeof result === "string") {
                    return result
                }
                output.push(result)
            }
            return output
        },
        schema: [1],
        vars: ["x", "f"],
        types: [TL(TA), TF],
        calc: true,
        example: "Examples:\n  1. \`f(x) = x^2; map(range(1, 3), f) -> [1, 4, 9]\`\n  2. \`map(range(1, 3), @(x) = x^2) -> [1, 4, 9]\`"
    },
    "filter": {
        name: "Filter",
        func: (list, func, calc) => {
            let output = []
            for (const e of list) {
                let tokens = [func.op, new Paren([e])]
                let result = calc.evaluate(tokens, { noAns: true, noRound: true })
                if (typeof result === "string") {
                    return result
                }
                if (result) {
                    output.push(e)
                }
            }
            return output
        },
        schema: [1],
        vars: ["x", "f"],
        types: [TL(TA), TF],
        calc: true,
        example: "Examples:\n  1. \`f(a) = a mod 2; filter(range(5), f) -> [1, 3, 5]\`\n  2. \`filter(range(5), @(a) = a mod 2) -> [1, 3, 5]\`"
    },
    "reduce": {
        name: "Reduce",
        func: (list, func, calc) => {
            if (list.length === 0) {
                return list
            }
            let acc = list[0]
            for (let i = 1; i < list.length; i++) {
                let tokens
                if (func.op in calc.functions) {
                    tokens = [func.op, new Paren([acc, list[i]])]
                } else if (OPERATIONS[func.op]) {
                    const e = OPERATIONS[func.op]
                    if (e.schema.length == 2 && e.schema[0] === -1) {
                        tokens = [acc, func.op, list[i]]
                    } else {
                        tokens = [func.op, new Paren([acc, list[i]])]
                    }
                }
                let result = calc.evaluate(tokens, { noAns: true, noRound: true })
                if (typeof result === "string") {
                    return result
                }
                acc = result
            }
            return acc
        },
        schema: [1],
        vars: ["x", "f"],
        types: [TL(TA), TF],
        calc: true,
        example: "Examples:\n  1. \`reduce(range(5), *) -> 120\`\n  2. \`reduce([1, -2, 10, 5], \n       @(x, y) = if x > y then x else y) -> 10\`"
    }, 
    "type": {
        name: "Type",
        func: (x) => {
            return new String(`\`${get_param_types([x])[0]}\``)
        },
        schema: [1],
        vars: ["x"],
        types: [TA],
        example: "Examples:\n  1. \`type(pi) -> number\n\`  2. \`type(0b101) -> number\`\n  3. \`type([1, 2, 3]) -> list[number]\`\n  4. \`type([[1, 2], [3, 4]]) -> list[list[number]]\`\n  5. \`type([1, 0b101, [2]]) -> list[any]\`\n  6. \`type(true) -> bool\`\n  7. \`type(km) -> unit\`\n  8. \`type(sin) -> function\`"
    },
    "index": {
        name: "Index",
        func: (A, I) => process_index(A, I),
        schema: [1],
        vars: ["A", "I"],
        types: [TL(TA), TL(TA)]
    },
    ":": {
        name: "Slice",
        func: (a, b) => {
            return [a, b]
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TN, TN],
        example: "Examples: \`A = [[1, 2, 3], [4, 5, 6, 7]]\`\n  1. \`A(2) -> [4, 5, 6, 7]\`\n  2. \`A(2, 2:3) -> [5, 6]\`\n  3. \`A(2, 2:) -> [5, 6, 7]\`\n  4. \`A(1, :2) -> [1, 2]\`\n  5. \`A(:, 1) -> [1, 4]\`"
    },
    ":2": {
        name: "Range pair",
        func: (a) => {
            return [false, a]
        },
        schema: [1],
        vars: ["a"],
        types: [TN]
    },
    ":3": {
        name: "Range pair",
        func: (a) => {
            return [a, false]
        },
        schema: [-1],
        vars: ["a"],
        types: [TN]
    },
    "len": {
        name: "List length",
        func: (list) => {
            return list.length
        },
        schema: [1],
        vars: ["x"],
        types: [TL(TA)]
    },
    "concat": {
        name: "Concatenate lists",
        func: (lists) => {
            let ans = []
            for (const l of lists) {
                if (Array.isArray(l)) {
                    ans.push(...l)
                } else {
                    ans.push(l)
                }
            }
            return ans
        },
        schema: [1],
        vars: ["a"],
        types: [TL(TA)],
        example: "Examples:\n  1. \`concat([1, 2], [3, 4]) -> [1, 2, 3, 4]\`\n  2. \`concat([1, 2], 3, 4) -> [1, 2, 3, 4]\`"
    },
    "rref": {
        name: "Reduced Row Echelon Form (RREF)",
        func: (m) => rref(m),
        schema: [1],
        vars: ["m"],
        types: [TL(TL(TN))]
    },
    "det": {
        name: "Determinant",
        func: (m) => det(m),
        schema: [1],
        vars: ["m"],
        types: [TL(TL(TN))]
    },
    "zeros": {
        name: "Create zero tensor",
        func: (dims) => create_zero_tensor(dims),
        schema: [1],
        vars: ["dims"],
        types: [TL(TA)],
        example: "Examples:\n  1. `zeros(2, 2) -> [[0, 0], [0, 0]]\n  2. zeros(1, 2, 3) -> [[[0, 0, 0], [0, 0, 0]]]`"
 },
    "ident": {
        name: "Create identity matrix",
        func: (n) => {
            const m = []
            for (let i = 0; i < n; i++) {
                m.push([])
                for (let j = 0; j < n; j++) {
                    m[i].push(0)
                }
                m[i][i] = 1
            }
            return m
        },
        schema: [1],
        vars: ["n"],
        types: [TN]
    },
    "tran": {
        name: "Transpose",
        func: (m) => {
            if (Array.isArray(m[0])) {
                const tm = []
                for (let j = 0; j < m[0].length; j++) {
                    tm.push([])
                    for (let i = 0; i < m.length; i++) {
                        tm[j].push(m[i][j])
                    }
                }
                return tm;
            } else {
                return m.map((x) => [x])
            }
        },
        schema: [1],
        vars: ["m"],
        types: [TOR(TL(TL(TN)), TL(TN))]
    },
    "inv": {
        name: "Inverse",
        func: (m) => inverse(m),
        schema: [1],
        vars: ["m"],
        types: [TL(TL(TN))]
    },
    "choose": {
        name: "Choose (# of combinations)",
        func: (n, k) => {
            return Math.round(factorial(n) / (factorial(k) * factorial(n - k)))
        },
        schema: [-1, 1],
        vars: ["n", "k"],
        types: [TN, TN]
    },
    "perm": {
        name: "Compute # of permutations",
        func: (n, k) => {
            return Math.round(factorial(n) / (factorial(n - k)))
        },
        schema: [-1, 1],
        vars: ["n", "k"],
        types: [TN, TN]
    },
    "rank": {
        name: "Rank",
        func: (m) => {
            if (m.length === 0 || m[0].length === 0) {
                return 0
            }
            const rref_m = rref(m)
            let rank = 0
            for (let i = 0; i < rref_m.length; i++) {
                const is_zero_row = rref_m[i].every(e => e === 0);
                if (!is_zero_row) {
                    rank++
                } 
            }
            return rank
        },
        schema: [1],
        vars: ["m"],
        types: [TL(TL(TN))]
    },
    "cross": {
        name: "Cross product",
        func: (a, b) => {
            if (a.length !== 3 || b.length !== 3) {
                return "Vectors must be 3-dimensional"
            }
            const result = [
                a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0],
            ]
            return result;
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TL(TN), TL(TN)]
    },
    "gcd": {
        name: "Greatest common divisor",
        func: (a, b) => gcd(a, b),
        schema: [1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    "lcm": {
        name: "Least common multiple",
        func: (a, b) => lcm(a, b),
        schema: [1],
        vars: ["a", "b"],
        types: [TN, TN]
    },
    "factor": {
        name: "Prime factorization",
        func: (n) => {
            let N = n
            const factors = []
            let divisor = 2
            while (n >= 2) {
                if (n % divisor == 0) {
                    factors.push(divisor);
                    n /= divisor;
                } else {
                    divisor++
                }
            }
            let factor_counts = factors.reduce((counts, factor) => {
                counts[factor] = (counts[factor] || 0) + 1;
                return counts;
            }, {})
            let formatted_factors = Object.entries(factor_counts)
                .sort((a, b) => a[0] - b[0])
                .map(([p, c]) => (c > 1 ? `${p}^${c}` : `${p}`))
            return new String(`${N} = ` + formatted_factors.join(" × "))
        },
        schema: [1],
        vars: ["n"],
        types: [TN]
    },
    "to": {
        name: "Convert units",
        func: (n, u2) => {
            if (!(n instanceof UnitNumber)) {
                return "Expected unit number"
            }
            let u1 = n.unit
            if (u2 instanceof Operation) {
                u2 = u2.op
            }
            for (const group of UNIT_GROUPS) {
                if (!group.includes(u2)) continue
                for (const current_unit in u1) {
                    if (group.includes(current_unit)) {
                        const exp = u1[current_unit]
                        if (TEMP_UNITS.includes(current_unit) && TEMP_UNITS.includes(u2)) {
                            const new_value = convert_to_unit(n.value(), current_unit, u2)
                            const new_unit = { ...u1 }
                            delete new_unit[current_unit]
                            new_unit[u2] = (new_unit[u2] || 1)
                            return new UnitNumber(new_value, new_unit)
                        } else {
                            const scalar = convert_to_unit(1, current_unit, u2)
                            const new_value = n.value() * (scalar ** exp)
                            const new_unit = { ...u1 }
                            delete new_unit[current_unit]
                            new_unit[u2] = (new_unit[u2] || 0) + exp
                            return new UnitNumber(new_value, new_unit)
                        }
                    }
                }
            }
            return "Invalid units"
        },
        schema: [-1, 1],
        vars: ["n_u1", "u2"],
        types: [TN, TU],
        example: "Tip: See all supported units by typing `units`\nExamples:\n  1. `5 km to mi -> 3.10686`\n  2. `C = cel; F = far; 30 C to F -> 86`\n",
        allow_units: true
    },
    "to2":  {
        name: "Convert units",
        func: (u1, u2) => {
            let n = 1
            if (u1 instanceof Operation) {
                u1 = u1.op
            }
            if (u2 instanceof Operation) {
                u2 = u2.op
            }
            let new_value
            if (u1 in FROM_UNITS && u2 in FROM_UNITS) {
                if (typeof FROM_UNITS[u1] === "number" && typeof FROM_UNITS[u2] === "number") {
                    new_value = n * FROM_UNITS[u1] * TO_UNITS[u2]
                } else if (typeof FROM_UNITS[u1] === "object" && typeof FROM_UNITS[u2] === "object") {
                    new_value = FROM_UNITS[u2].to(FROM_UNITS[u1].from(n))
                }
                return new UnitNumber(new_value, { [u2]: 1 })
            }
            return "Invalid units"
        },
        schema: [-1, 1],
        vars: ["u1", "u2"],
        types: [TU, TU],
        allow_units: true
    },
    "==": {
        name: "Equal",
        func: (a, b) => {
            if (Array.isArray(a) && Array.isArray(b)) {
                return tensors_equal(a, b)
            }
            return a === b
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA],
        allow_units: true
    },
    "!=": {
        name: "Not equal",
        func: (a, b) => {
            if (Array.isArray(a) && Array.isArray(b)) {
                return !tensors_equal(a, b)
            }
            return a !== b
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA],    
        allow_units: true
    },
    "true": {
        name: "True",
        func: () => true,
        schema: [],
        vars: [],
        types: []
    },
    "false": {
        name: "False",
        func: () => false,
        schema: [],
        vars: [],
        types: []
    },
    "eval_if": {
        name: "Evaluate if statement",
        func: (if_st, calc) => eval_if(if_st, calc),
        schema: [1],
        vars: [],
        types: [TI],
        calc: true,
    },
    "<": {
        name: "Less than",
        func: (a, b) => {
            return a < b
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA],    
        allow_units: true
    },
    "<=": {
        name: "Less than or equal",
        func: (a, b) => {
            return a <= b
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA],    
        allow_units: true
    },
    ">": {
        name: "Greater than",
        func: (a, b) => {
            return a > b
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA],    
        allow_units: true
    },
    ">=": {
        name: "Greater than or equal",
        func: (a, b) => {
            return a >= b
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA],    
        allow_units: true
    },
    "and": {
        name: "And",
        func: (a, b) => {
            return a && b ? true : false
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA]
    },
    "or": {
        name: "Or",
        func: (a, b) => {
            return a || b ? true : false
        },
        schema: [-1, 1],
        vars: ["a", "b"],
        types: [TA, TA]
    },
    "not": {
        name: "Not",
        func: (x) => {
            return !x ? true : false
        },
        schema: [1],
        vars: ["x"],
        types: [TA]
    },
    "flat": {
        name: "Flatten list",
        func: (a) => flatten(a),
        schema: [1],
        vars: ["a"],
        types: [TL(TA)],
        example: "Example: \`flat([[[1]], [2], 3]) -> [1, 2, 3]\`"
    },
    "hh": {
        name: "Planck's constant",
        func: () => new UnitNumber(6.62607015e-34, { "jl": 1, "se": 1 }),
        schema: [],
        vars: [],
        types: []
    },
    "cc": {
        name: "Speed of light in vacuum",
        func: () => new UnitNumber(299792458, { "me": 1, "se": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "qe": {
        name: "Elementary charge (p+, e-)",
        func: () => new UnitNumber(1.60217663e-19, { "cu": 1 }),
        schema: [],
        vars: [],
        types: []
    },
    "u0": {
        name: "Vacuum magnetic permittivity",
        func: () => new UnitNumber(1.25663706127e-6, { "ne": 1, "am": -2 }),
        schema: [],
        vars: [],
        types: []
    },
    "e0": {
        name: "Vacuum electric permittivity",
        func: () => new UnitNumber(8.8541878188e-12, { "fa": 1, "me": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mel": {
        name: "Mass of an electron",
        func: () => new UnitNumber(9.1093837015e-31, { "kg": 1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mp": {
        name: "Mass of a proton",
        func: () => new UnitNumber(1.67262192369e-27, { "kg": 1 }),
        schema: [],
        vars: [],
        types: []
    },
    "si": {
        name: "Convert to SI Units",
        func: (x) => {
            if (x instanceof Operation) {
                x = x.op
                if (x in SI_EXPANSIONS) {
                    return new UnitNumber(1, SI_EXPANSIONS[x])
                } else {
                    return new Operation(x)
                }
            }
            if (!(x instanceof UnitNumber)) {
                return x
            }
            const new_unit = {}
            for (const u in x.unit) {
                if (u in SI_EXPANSIONS) {
                    for (const u_si in SI_EXPANSIONS[u]) {
                        if (!(u_si in new_unit)) {
                            new_unit[u_si] = 0
                        }
                        new_unit[u_si] += x.unit[u] * SI_EXPANSIONS[u][u_si]
                    }
                } else {
                    if (!(u in new_unit)) {
                        new_unit[u] = 0
                    }
                    new_unit[u] += x.unit[u]
                }
            }
            return new UnitNumber(x.value(), new_unit)
        },  
        schema: [1],
        vars: ["x"],
        types: [TOR(TN, TU)],
        allow_units: true,
    },
    "gg": {
        name: "Gravitational constant",
        func: () => new UnitNumber(6.67430e-11, { "me": 3, "kg": -1, "se": -2 }),
        schema: [],
        vars: [],
        types: []
    },
    "ge": {
        name: "Gravitational acceleration on Earth",
        func: () => new UnitNumber(9.80665, { "me": 1, "se": -2 }),
        schema: [],
        vars: [],
        types: []
    },
    "rr": {
        name: "Universal gas constant",
        func: () => new UnitNumber(8.314462618, { "jl": 1, "mol": -1, "kel": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "na": {
        name: "Avogadro's number",
        func: () => new UnitNumber(6.02214076e23, { "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mH": {
        name: "Molar mass of Hydrogen",
        func: () => new UnitNumber(1.00784, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mHe": {
        name: "Molar mass of Helium",
        func: () => new UnitNumber(4.002602, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mLi": {
        name: "Molar mass of Lithium",
        func: () => new UnitNumber(6.938, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mBe": {
        name: "Molar mass of Beryllium",
        func: () => new UnitNumber(9.0121831, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mB": {
        name: "Molar mass of Boron",
        func: () => new UnitNumber(10.806, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mC": {
        name: "Molar mass of Carbon",
        func: () => new UnitNumber(12.0106, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mN": {
        name: "Molar mass of Nitrogen",
        func: () => new UnitNumber(14.00643, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mO": {
        name: "Molar mass of Oxygen",
        func: () => new UnitNumber(15.999, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mF": {
        name: "Molar mass of Fluorine",
        func: () => new UnitNumber(18.998403163, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mNe": {
        name: "Molar mass of Neon",
        func: () => new UnitNumber(20.1797, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mNa": {
        name: "Molar mass of Sodium",
        func: () => new UnitNumber(22.98976928, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mMg": {
        name: "Molar mass of Magnesium",
        func: () => new UnitNumber(24.304, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mAl": {
        name: "Molar mass of Aluminum",
        func: () => new UnitNumber(26.9815385, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mSi": {
        name: "Molar mass of Silicon",
        func: () => new UnitNumber(28.084, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mP": {
        name: "Molar mass of Phosphorus",
        func: () => new UnitNumber(30.973761998, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mS": {
        name: "Molar mass of Sulfur",
        func: () => new UnitNumber(32.059, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mCl": {
        name: "Molar mass of Chlorine",
        func: () => new UnitNumber(35.446, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mAr": {
        name: "Molar mass of Argon",
        func: () => new UnitNumber(39.948, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mK": {
        name: "Molar mass of Potassium",
        func: () => new UnitNumber(39.0983, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mCa": {
        name: "Molar mass of Calcium",
        func: () => new UnitNumber(40.078, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mTi": {
        name: "Molar mass of Titanium",
        func: () => new UnitNumber(47.867, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mCr": {
        name: "Molar mass of Chromium",
        func: () => new UnitNumber(51.9961, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mMn": {
        name: "Molar mass of Manganese",
        func: () => new UnitNumber(54.938044, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mFe": {
        name: "Molar mass of Iron",
        func: () => new UnitNumber(55.845, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mCo": {
        name: "Molar mass of Cobalt",
        func: () => new UnitNumber(58.933194, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mNi": {
        name: "Molar mass of Nickel",
        func: () => new UnitNumber(58.6934, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mCu": {
        name: "Molar mass of Copper",
        func: () => new UnitNumber(63.546, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mZn": {
        name: "Molar mass of Zinc",
        func: () => new UnitNumber(65.38, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mAg": {
        name: "Molar mass of Silver",
        func: () => new UnitNumber(107.8682, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mAu": {
        name: "Molar mass of Gold",
        func: () => new UnitNumber(196.966569, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mHg": {
        name: "Molar mass of Mercury",
        func: () => new UnitNumber(200.592, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mPb": {
        name: "Molar mass of Lead",
        func: () => new UnitNumber(207.2, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    },
    "mU": {
        name: "Molar mass of Uranium",
        func: () => new UnitNumber(238.02891, { "gm": 1, "mol": -1 }),
        schema: [],
        vars: [],
        types: []
    }
}
for (let i = 0; i < UNITS.length; i++) {
    OPERATIONS[UNITS[i]] = {
        name: UNIT_NAMES[UNITS[i]],
        func: (n) => {
            const u = {}
            u[UNITS[i]] = 1
            return new UnitNumber(n, u)
        },
        schema: [-1],
        vars: ["n"],
        types: [TN]
    }
}

const HELP = {
    "@": {
        name: "Lambda function",
        schema: [1],
        vars: ["(...params) = value"],
        types: [TF],
        example: "Examples:\n  1. \`@(x) = x^2\`\n  2. \`@(x, y) = x + y\`\n  3. \`@() = 1\`"
    },
    "clear": {
        name: "Clear",
        schema: [1],
        vars: ["N"],
        types: [TO(TN)],
    },
    "help": {
        name: "Help",
        schema: [1],
        vars: ["func"],
        types: [TF]
    },
    "ans": {
        name: "Answer",
        schema: [],
        vars: [],
        types: []
    },
    "save": {
        name: "Save",
        schema: [1],
        vars: ["x"],
        types: ["variable | function"]
    },
    "if": {
        name: "If statement",
        schema: [],
        vars: [],
        types: [],
        example: "Examples:\n  1. \`if x > 10 then 10 else x\` \n  2. \`if x == 20 then 2 else if x == 10 then 1 else 0\`"
    },
    "then": {
        name: "If statement",
        schema: [],
        vars: [],
        types: [],
        example: "Examples:\n  1. \`if x > 10 then 10 else x\` \n  2. \`if x == 20 then 2 else if x == 10 then 1 else 0\`"
    },
    "else": {
        name: "If statement",
        schema: [],
        vars: [],
        types: [],
        example: "Examples:\n  1. \`if x > 10 then 10 else x\` \n  2. \`if x == 20 then 2 else if x == 10 then 1 else 0\`"
    },
    "trace": {
        name: "Debug trace",
        schema: [1],
        vars: ["x"],
        types: ["expression"],
        example: "Tip: Use trace to debug recursive functions or view the intermediate steps of a calculation.\nExample: `fact(n) = if n <= 1 then 1 else n * fact(n - 1)`\n  1. `trace fact(5)`\n  2. `trace sin(cos(tan(pi)))`"
    },
    "plot": {
        name: "Plot",
        schema: [1],
        vars: ["x"],
        types: ["expression"]
    },
    "diff": {
        name: "Differentiation",
        schema: [1],
        vars: ["x"],
        types: ["expression"],
        example: "Examples: `g(y) = y^2 * sin(y)`\n  1. Derivative of a function: `diff g`\n  2. Expression of `x`: `diff x^2 * sin(x)`"
    },
    "bal": {
        name: "Balance chemistry equation",
        schema: [1],
        vars: ["x"],
        types: ["expression"],
        example: "Example: \`bal Ca(OH)2 + HCl = CaCl2 + H2O\`\nOutput: `\
Ca(OH)2 + 2HCl → CaCl2 + 2H2O\`"
    },
}

// Determine if string is name of math function 
// Math function - in OPERATIONS but not a symbol
function isMathFunction(e) {
    return typeof e === "string" && e in OPERATIONS && !SYMBOLS.includes(e)
}

// Operation wrapper class
class Operation {
    constructor(op) {
        this.op = op
    }

    toString() {
        return `${this.op}`
    }
}
 
class Paren {
    constructor(tokens) {
        this.tokens = tokens
    }
}

class Fraction {
    constructor(n, d) {
        this.neg = false
        this.invalid = false
        if (typeof n === "number" && typeof d === "number") {
            if (n === 0 && d === 0) {
                this.invalid = "0/0"
                return
            }
            if (d === 0) {
                this.invalid = "/0"
                this.n = n
                this.d = d
                return
            }
            this.neg = (n < 0) ^ (d < 0)
            let my_gcd = gcd(Math.abs(n), Math.abs(d))
            this.n = Math.abs(n) / my_gcd
            this.d = Math.abs(d) / my_gcd
        } else {
            this.n = n
            this.d = d
            if (typeof n == "number" && this.n < 0) {
                this.n = Math.abs(n)
                this.neg = true
            }
            if (typeof d == "number" && this.d < 0) {
                this.d = Math.abs(d)
                this.neg = true
            }
        }
    }

    toString() {
        if (this.n === 0) {
            return this.n
        }
        if (this.d === 1) {
            return `${this.neg ? "-" : ""}${this.n}`
        }
        return `${this.neg ? "-" : ""}${this.n}/${this.d}`
    }

    value() {
        return this.n / this.d * (this.neg ? -1 : 1)
    }
}

class BaseNumber {
    constructor(b) {
        this.b = b
    }

    toString() {
        return `${this.b}`
    }

    value() {
        return convert_to_decimal(this.b)
    }
}

class UnitNumber {
    constructor(num, unit = {}) {
        this.num = num
        this.unit = unit
        this.simplify_units()
    }

    simplify_units() {
        const original_unit = {...this.unit}
        const simplified_unit = {}
        let value = this.num instanceof Fraction || this.num instanceof BaseNumber ? this.num.value() : this.num
        const group_counts = {}
        for (const group of UNIT_GROUPS) {
            group_counts[group[0]] = 0
        }
        for (const unit of Object.keys(original_unit)) {
            for (const group of UNIT_GROUPS) {
                if (group.includes(unit)) {
                    group_counts[group[0]]++;
                    break
                }
            }
        }
        for (const [unit, exponent] of Object.entries(original_unit)) {
            if (exponent === 0) continue
            let converted = false
            for (const group of UNIT_GROUPS) {
                if (group.includes(unit)) {
                    const base_unit = group[0]
                    if (group_counts[base_unit] > 1) {
                        if (unit !== base_unit) {
                            if (typeof FROM_UNITS[unit] === "number" && typeof TO_UNITS[base_unit] === "number") {
                                const conversion_factor = FROM_UNITS[unit] * TO_UNITS[base_unit]
                                value *= Math.pow(conversion_factor, exponent);
                                simplified_unit[base_unit] = (simplified_unit[base_unit] || 0) + exponent;
                                converted = true
                            } else if (typeof FROM_UNITS[unit] === "object") {
                                simplified_unit[unit] = (simplified_unit[unit] || 0) + exponent
                                converted = true
                            }
                        } else {
                            simplified_unit[unit] = (simplified_unit[unit] || 0) + exponent
                            converted = true
                        }
                    }
                    break
                }
            }
            if (!converted) {
                simplified_unit[unit] = (simplified_unit[unit] || 0) + exponent
            }
        }
        for (const unit in simplified_unit) {
            if (simplified_unit[unit] === 0) {
                delete simplified_unit[unit]
            }
        }
        this.num = value
        this.unit = simplified_unit
    }

    value() {
        return this.num instanceof Fraction || this.num instanceof BaseNumber ? this.num.value() : this.num
    }

    toString() {
        const value = set_precision(this.value(), calculator ? calculator.digits : 12)
        const unit_str = this.format_unit()
        if (value === 1) {
            if (unit_str.length) {
                return unit_str
            } else {
                return "1"
            }
        }
        if (unit_str.length === 0) {
            return `${value}`
        }
        return `${value} ${unit_str}`
    }

    format_unit() {
        let num_units = []
        let denom_units = []
        for (const [u, exp] of Object.entries(this.unit)) {
            if (exp > 0) {
                num_units.push(exp === 1 ? u : `${u}^${exp}`)
            }
            if (exp < 0) {
                denom_units.push(exp === -1 ? u : `${u}^${-exp}`)
            }
        }
        let numerator = num_units.join(" * ")
        let denominator = denom_units.join(" * ")
        if (numerator.length == 0) {
            num_units = []
            for (const [u, exp] of Object.entries(this.unit)) {
                num_units.push(`${u}^${exp}`)
            }
            numerator = num_units.join(" * ")
            denominator = ""
        }
        if (denominator) {
            if (denom_units.length > 1) {
                denominator = `(${denominator})`
            }
            return `${numerator}/${denominator}`
        } else {
            return numerator
        }
    }

    static multiply_units(u1, u2) {
        let result = { ...u1 }
        for (let key in u2) {
            result[key] = (result[key] || 0) + u2[key]
            if (result[key] === 0) {
                delete result[key]
            }
        }
        return result
    }

    static divide_units(u1, u2) {
        let inverted = {}
        for (let key in u2) {
            inverted[key] = -u2[key]
        }
        return UnitNumber.multiply_units(u1, inverted)
    }

    static pow_unit(u, exp) {
        const result = {};
        for (const key in u) {
            result[key] = (u[key] || 0) * exp;
        }
        return result
    }

    multiply(other) {
        return new UnitNumber(
            this.value() * other.value(),
            UnitNumber.multiply_units(this.unit, other.unit)
        )
    }

    divide(other) {
        return new UnitNumber(
            this.value() / other.value(),
            UnitNumber.divide_units(this.unit, other.unit)
        )
    }

    add(other) {
        if (!UnitNumber.same_units(this.unit, other.unit)) {
            return "Unit mismatch"
        }
        return new UnitNumber(this.value() + other.value(), this.unit)
    }

    subtract(other) {
        if (!UnitNumber.same_units(this.unit, other.unit)) {
            return "Unit mismatch"
        }
        return new UnitNumber(this.value() - other.value(), this.unit)
    }

    static same_units(u1, u2) {
        const keys = new Set([...Object.keys(u1), ...Object.keys(u2)])
        for (let key of keys) {
            if ((u1[key] || 0) !== (u2[key] || 0)) {
                return false
            }
        }
        return true
    }
}


function convert_to_unit(n, u1, u2) {
    if (typeof FROM_UNITS[u1] === "number" && typeof FROM_UNITS[u2] === "number") {
        return n * FROM_UNITS[u1] * TO_UNITS[u2]
    } else if (typeof FROM_UNITS[u1] === "object" && typeof FROM_UNITS[u2] === "object") {
        return FROM_UNITS[u1].to(FROM_UNITS[u2].from(n))
    }
}

function get_param_types(params) {
    const type_list = []
    // console.log("get_param_types", params)
    for (const p of params) {
        if (typeof p === "number" || p instanceof Fraction || p instanceof BaseNumber || p instanceof UnitNumber) {
            type_list.push(TN)
        } else if (typeof p === "boolean" || ["true", "false"].includes(p)) {
            type_list.push(TB)
        } else if (p instanceof String) {
            type_list.push(TS)
        } else if (Array.isArray(p)) {
            if (p.length === 0) {
                type_list.push(TL(TA))
            } else {
                const types = p.map((t) => get_param_types([t])[0])
                if (types.every((t) => t === types[0])) {
                    type_list.push(TL(types[0]))
                } else {
                    type_list.push(TL(TA))
                }
            }
        } else if (p instanceof Operation) {
            if (p.op in UNIT_NAMES) {
                type_list.push(TU)
            } else {
                type_list.push(TF)
            }
        } else if (p in UNIT_NAMES) {
            type_list.push(TU)
        } else {
            type_list.push(TI)
        }
    }
    return type_list
}

function check_param_types(param_types, correct_types) {
    // console.log("check_param_types", param_types, correct_types)
    if (correct_types.length === 1 && correct_types[0] === TA) {
        return true
    }
    let valid = 0
    for (let i = 0; i < correct_types.length; i++) {
        let ct = correct_types[i]
        let pt = i < param_types.length ? param_types[i] : null
        if (ct === TA) {
            valid++
            continue
        }
        // OR
        if (ct.includes("|")) {
            ct = ct.split("|").map((e) => e.trim())
            for (const t of ct) {
                if (check_param_types([pt], [t])) {
                    valid++
                    break
                }
            }
        } else if (ct.startsWith("optional")) {
            const open = ct.indexOf("[")
            const close = ct.lastIndexOf("]")
            if (pt === null || pt === ct.slice(open + 1, close)) {
                valid++
            }
        } else if (ct === TL(TA)) {
            if (pt.startsWith("list[")) {
                valid++
            }
        } else if (ct === TL(TL(TA))) {
            if (pt.startsWith("list[list[")) {
                valid++
            }
        } else {
            if (pt === ct) {
                valid++
            }
        }
    }
    return valid === correct_types.length
}

function parseCoefficient(coefficient) {
    if (coefficient === "" || coefficient === "+") return 1
    if (coefficient === "-") return -1
    return parseFloat(coefficient) || 0
}

function is_multipliable(token) {
    let param_type = get_param_types([token])
    return param_type == TN || param_type == TL(TN) || param_type == TL(TL(TN)) || (token instanceof Operation && UNITS.includes(token.op))
}

for (const c of CONSTANTS) {
    OPERATIONS[c]["example"] = `Value: \`${OPERATIONS[c].func()}\``
}

for (const u in SI_EXPANSIONS) {
    OPERATIONS[u]["example"] = `SI: \`${u} = ${new UnitNumber(1, SI_EXPANSIONS[u])}\``
}