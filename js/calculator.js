// Calculator 
// By: Rohan Phanse

// Calculator
class Calculator {
    constructor (params) {
        this.digits = params ? params.digits : 12
        this.angle = params ? params.angle : "rad"
        this.ans = null
        this.variables = {}
        this.functions = {}
        this.overflow_count = 0
        this.overflow_max = 100000
        this.lambda_counter = 0
        this.parameter_context = {}
        this.debug = false
        this.debug_log = []
        this.debug_depth = 0
    }

    // Parse raw expression into tokens
    parse(expression, options = {}) {
        const tokens = []
        // Includes @ or =
        if (expression.includes("@")) {
            while (expression.includes("@(") && expression.lastIndexOf("@(") !== -1) {
                let bracket_count = 0
                let paren_count = 0
                let start = expression.lastIndexOf("@(")
                let active = false
                for (let i = start + 1; i < expression.length; i++) {
                    if (expression.charAt(i) === "[") {
                        bracket_count++ 
                    }
                    if (expression.charAt(i) === "(") {
                        paren_count++
                    }
                    if (expression.charAt(i) === "]") {
                        bracket_count--
                        if (start !== -1 && bracket_count === -1) {
                            active = true
                        }
                    }
                    if (expression.charAt(i) === ")") {
                        paren_count--
                        if (start !== -1 && paren_count === -1) {
                            active = true
                        }
                    }
                    if (start !== -1 && (expression.charAt(i) === "," && bracket_count === 0 && paren_count === 0)
                    ) {
                        active = true
                    }
                    if (start !== -1 && !active && i === expression.length - 1) {
                        i++
                        active = true
                    }
                    if (active) {
                        this.lambda_counter++
                        const expr = `@${this.lambda_counter}${expression.slice(start + 1, i)}`
                        const result = this.declareFunction(expr, { ignore_name: true, ignore_vars: true })
                        if (typeof result === "string") {
                            return result
                        }
                        expression = `${expression.slice(0, start)}@${this.lambda_counter}${expression.slice(i)}`
                        break
                    }
                }
            }
        }
        let eq_i = expression.indexOf("=")
        if (eq_i !== -1 && eq_i > 0 && eq_i < expression.length - 1 && expression[eq_i + 1] !== "=" && !["<", ">", "!"].includes(expression[eq_i - 1])) {
            const before_equals = expression.slice(0, eq_i)
            if (before_equals.includes("(") && before_equals.includes(")")) {
                return this.declareFunction(expression)
            } else {
                return this.declareVariable(expression)
            }
        }
        // Loop through string
        for (let i = 0; i < expression.length; i++) {
            if (expression.charAt(i).trim().length === 0) {
                continue
            }
            let double_symbol = expression.substr(i, 2)
            // Symbol
            if (!/^[a-zA-Z]$/.test(expression.charAt(i)) && (SYMBOLS.includes(expression.charAt(i)) || SYMBOLS.includes(double_symbol))) {
                if (SYMBOLS.includes(double_symbol)) {
                    tokens.push(double_symbol) 
                    i++
                } else {
                    tokens.push(expression.charAt(i))
                }
            // Number
            } else if (!isNaN(expression.charAt(i))) {
                if (expression.charAt(i) === "0" && i < expression.length - 1 && ["b", "o", "x"].includes(expression.charAt(i + 1))) {
                    let check
                    const base = expression.charAt(i + 1)
                    switch (base) {
                        case "b":
                            check = (x) => /^[01]+$/.test(x)
                            break
                        case "x":
                            check = (x) => /^[0-9a-fA-F]+$/.test(x)
                            break
                        case "o":
                            check = (x) => /^[0-7]+$/.test(x)
                            break
                    }
                    const str = this.peek(expression, i + 1, "string")
                    if (check(str.slice(1))) {
                        tokens.push(new BaseNumber(`0${str}`))
                        i += str.length
                    } else {
                        return "Invalid base string"
                    }
                } else {
                    const number = this.peek(expression, i, "number")
                    tokens.push(+number)
                    i += number.length - 1
                }
            // Letter
            } else if (/^[a-zA-Z]+$/i.test(expression.charAt(i))) {
                const string = this.peek(expression, i, "string")
                // Function parameter
                if (string === "if") {
                    let if_st = parse_if(expression.slice(i))
                    if (typeof if_st === "string") {
                        return if_st
                    }
                    i += if_st.length - 1
                    tokens.push("eval_if")
                    tokens.push(if_st)
                } else if (options?.functionParameters?.includes(string)) {
                    tokens.push(string)
                    i += string.length - 1
                // Operation
                } else if (string in OPERATIONS) {
                    tokens.push(string)
                    i += string.length - 1
                // Ans keyword
                } else if (string === "ans") {
                    if (typeof this.ans !== "string" && this.ans !== null) {
                        tokens.push(string)
                        i += string.length - 1
                    } else {
                        return "Answer error"
                    }
                // Variable
                } else if (options.ignore_vars) {
                    tokens.push(string)
                    i += string.length - 1
                } else if (string in this.parameter_context) {
                    tokens.push(this.parameter_context[string])
                    i += string.length - 1
                } else if (string in this.variables) {
                    tokens.push(this.variables[string])
                    i += string.length - 1
                } else if (string in this.functions) {
                    tokens.push(string)
                    i += string.length - 1
                } else if (string.length >= 3 && string[0] === "m" && string[1] === string[1].toUpperCase()) {
                    const regex = /([A-Z][a-z]?)(\d*)/g
                    let result = []
                    let match
                    while ((match = regex.exec(string.slice(1))) !== null) {
                        const element = match[1]
                        const count = match[2] === "" ? 1 : parseInt(match[2], 10)
                        result.push([element, count])
                    }
                    let molar_mass = 0
                    for (const [element, count] of result) {
                        if (!CONSTANTS.includes(`m${element}`) || isNaN(count)) {
                            return `Unknown string "${string}" at position ${i + 1}`
                        }
                        molar_mass += OPERATIONS[`m${element}`].func().value() * count
                    }
                    tokens.push(new UnitNumber(molar_mass, { "gm": 1, "mol": -1 }))
                    i += string.length - 1
                } else {
                    return `Unknown string "${string}" at position ${i + 1}`
                }
            } else if (expression.charAt(i) === "@") {
                const number = this.peek(expression, i + 1, "number")
                tokens.push(`@${number}`)
                i += number.length
            // Special characters
            } else if (["(", ")", "[", "]", ","].includes(expression[i])) {
                tokens.push(expression[i])
            // Unknown character
            } else {
                return `Unknown character "${expression[i]}" at position ${i + 1}`
            }
        }
        for (let i = 0; i < tokens.length; i++) {
            // Unpack Operation stored in variable for function call
            if (tokens[i] instanceof Operation) {
                if (i < tokens.length - 1 && ![",", "]", ")"].includes(tokens[i + 1])) {
                    tokens[i] = tokens[i].op
                    continue
                }
            }
            // Store function as Operation object
            if (this.functions[tokens[i]] || (OPERATIONS[tokens[i]] && !CONSTANTS.includes(tokens[i]))) {
                if ((i === tokens.length - 1 || [",", "]", ")"].includes(tokens[i + 1])) && typeof tokens[i] === "string") {
                    if (tokens[i] !== "!" || (tokens[i] === "!" && i > 0 && tokens[i - 1] === ",")) {
                        tokens[i] = new Operation(tokens[i])
                    }
                }
            }
        }
        // Number parentheses and brackets
        for (const [a, b] of [["(", ")"], ["[", "]"]]) {
            let paren_counter = 1
            const error_message = a === "(" ? "Parenthesis error" : "Bracket error"
            if (tokens.includes(a) || tokens.includes(b)) {
                for (let i = 0; i < tokens.length; i++) {
                    // Closing parenthesis before opening parenthesis
                    if (paren_counter < 1) {
                        return error_message
                    }
                    if (tokens[i] === a) {
                        tokens[i] = `${tokens[i]}${paren_counter}`
                        paren_counter++
                    } else if (tokens[i] === b) {
                        paren_counter--
                        tokens[i] = `${tokens[i]}${paren_counter}`
                    }
                }
                // Different number of opening and closing parentheses
                if (paren_counter !== 1) {
                    return error_message
                }
            }
        }
        return tokens
    }

    // Peek ahead from given index in string and return substring which satisfies given criteria
    peek(string, index, type) {
        let length = 1
        while (index + length <= string.length) {
            if (string.charAt(index).trim().length === 0) continue
            const s = string.substr(index, length)
            let fail = false
            switch (type) {
                case "number":
                    if (/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s)) break
                    if (/[eE][+-]?\d*$/.test(s)) {
                        if (/^[+-]?\d/.test(string.substr(index + length))) break
                    }
                    fail = true
                    break
                case "string":
                    fail = !/^[a-zA-Z][a-zA-Z0-9_']*$/i.test(s)
            }
            if (fail) break
            length++
        }
        return string.substr(index, length - 1)
    }

    // Declare variable 
    declareVariable(expression) {
        try {
            let [name, value] = expression.split("=").map((x) => x.trim())
            let status = 0
            // Name is alphabetic
            if (/^[a-zA-Z][a-zA-Z0-9_']*$/i.test(name)) {
                // Name is an operation or keyword
                if (name in OPERATIONS || KEYWORDS.includes(name) || name in this.functions) {
                    return "Variable assignment error > name taken error"
                }
                status++
            }
            // Calculate variable value
            const result = this.calculate(value, { noAns: true, noRound: true })
            if (typeof result !== "string") {
                status++
            } else {
                return `Variable assignment error > ${result}`
            }
            // Variable name and value valid
            if (status === 2) {
                let redeclared = false
                if (name in this.variables) {
                    redeclared = true
                }
                this.variables[name] = result
                return new String(`Variable \`${name}\` ${redeclared ? "reassigned" : "declared"}`)  
            } else {
                return "Variable assignment error"
            }
        } catch (err) {
            return "Variable assignment error"
        }
    }

    declareFunction(expression, options = {}) {
        // console.log("declareFunction", expression)
        try {
            const eq_i = expression.indexOf("=")
            expression = [
                expression.slice(0, eq_i).trim(), 
                expression.slice(eq_i + 1).trim()  
            ]
            // console.log("declareFunction", expression)
            // if (expression.length !== 2) {
            //     return "Function equals error"
            // }
            if (!(count(expression[0], "(") === 1 
                && count(expression[0], ")") === 1 
                && expression[0].indexOf("(") < expression[0].indexOf(")")
            )) {
                return "Function declaration error > parentheses error"
            }
            const name = expression[0].slice(0, expression[0].indexOf("("))
            if (!options?.ignore_name && !/^[a-zA-Z][a-zA-Z0-9_']*$/i.test(name)) {
                return "Function declaration error > name error"
            }
            if (name in OPERATIONS || KEYWORDS.includes(name) || name in this.variables) {
                return "Function declaration error > name error"
            }
            let parameters = expression[0].slice(expression[0].indexOf("(") + 1, expression.indexOf(")")).split(",").map((x) => x.trim())
            if (parameters.length === 1 && parameters[0].length === 0) {
                parameters = []
            } else if (!(parameters.filter(e => /^[a-zA-Z][a-zA-Z0-9_]*$/i.test(e)).length === parameters.length && 
                (new Set(parameters)).size === parameters.length
            )) {
                return "Function declaration error > invalid parameters"
            }
            const value = this.parse(expression[1], { functionParameters: [...parameters, name], ignore_vars: options.ignore_vars })      
    
            if (typeof value === "string") {
                return `Function declaration error > ${value}` 
            } else {
                let redeclared = false
                if (name in this.functions) {
                    redeclared = true
                }
                this.functions[name] = {
                    parameters,
                    value,
                    string: `${name}(${parameters.join(",")}) = ${expression[1]}`
                }
                if (name.startsWith("@")) {
                    this.functions[name].string = `@(${parameters.join(", ")}) = ${expression[1]}`
                }
                return new String(`Function \`${name}\` ${redeclared ? "re" : ""}declared`)
            }
        } catch (err) {
            // console.log(err)
            return "Function declaration error"
        }
    }

    // Initialize array
    initializeArray(tokens) {
        // console.log("initializeArray", tokens)
        try {
            const array = []
            let start = 0
            let close = null
            for (let t = 0; t < tokens.length; t++) {
                if (typeof tokens[t] === "string" && tokens[t].startsWith("(")) {
                    close = `)${tokens[t].slice(1)}`
                }
                if (tokens[t] === close) {
                    close = null
                }
                if (tokens[t] === "," && close == null) {
                    array.push(tokens.slice(start, t))
                    start = t + 1
                } else if (t === tokens.length - 1) {
                    array.push(tokens.slice(start, t + 1))
                }
            }

            for (let a = 0; a < array.length; a++) {
                if (!Array.isArray(array[a][0]) || array[a].length > 2) {
                    const result = this.evaluate(array[a], { noAns: true, noRound: true })
                    if (typeof result === "string") {
                        throw "Error"
                    } else {
                        array[a] = result
                    }
                } else {
                    array[a] = array[a][0]
                }
            }
            return array
        } catch (err) {
            // console.log("error", err)
            return "Array error"
        }
    }

    evaluateFunction(tokens, index) {
        // console.log("evaluateFunction", tokens, index)
        this.overflow_count++
        if (this.overflow_count > this.overflow_max) {
            return "Overflow error: too many function calls"
        }
        let func_parameters = null
        try {
            // console.log("evaluateFunction", tokens, "index", index)
            const func = this.functions[tokens[index]]
            let parameters = tokens[index + 1]
            if (parameters instanceof Paren) {
                parameters = parameters.tokens
            } else {
                parameters = [parameters]
            }
            if (parameters.length !== func.parameters.length) {
                return `Function ${tokens[index]} > parameter error: expected ${func.parameters.length} parameter${func.parameters.length !== 1 ? "s" : ""} but received ${parameters.length} parameters`
            }
            for (let i = 0; i < func.parameters.length; i++) {
                this.parameter_context[func.parameters[i]] = parameters[i]
            }
            func_parameters = func.parameters
            const value = [...func.value]
            for (let v = 0; v < value.length; v++) {
                for (let p = 0; p < func.parameters.length; p++) {
                    if (value[v] === func.parameters[p]) {
                        value[v] = parameters[p]
                    }
                }
                if (value[v] instanceof Operation && value[v].op.startsWith("@")) {
                    const result = this.duplicateLambdas(value[v].op, func.parameters, parameters)
                    if (result) {
                        value[v] = result
                    }
                }
            }
            // console.log("this.functions", this.functions)
            let debug_str
            if (this.debug) {
                let debug_params = []
                for (const p of parameters) {
                    if (typeof p === "object" && p.cond) {
                        // console.log("skip")
                    } else {
                        debug_params.push(this.evaluate([p], { noAns: true }))
                    }
                }
                debug_str = `${tokens[index]}(${debug_params.join(", ")})`
                this.debug_log.push([this.debug_depth, debug_str])
                this.debug_depth++
            }
            const result = this.evaluate(value, { noAns: true, noRound: true })
            if (this.debug) {
                const result_string = this.evaluate(value, { noAns: true })
                this.debug_depth--
                this.debug_log.push([this.debug_depth, `${debug_str} -> ${result_string}`])
            }
            // console.log("result", result)
            for (let i = 0; i < func_parameters.length; i++) {
                delete this.parameter_context[func_parameters[i]]
            }
            if (typeof result === "string")
                return `Function ${tokens[index]} > ${result}`
            else {
                tokens.splice(index, 2, result)
                return tokens
            }
        } catch (err) {
            // console.log("evaluateFunction", err)
            try {
                // Remove parameters from parameter context
                if (func_parameters) {
                    for (let i = 0; i < func_parameters.length; i++) {
                        delete this.parameter_context[func_parameters[i]]
                    }
                }
            } catch (e) {
                // console.log("evaluateFunction", e)
                return `Function ${tokens[index]} > Evaluation error`
            }
            return `Function ${tokens[index]} > Evaluation error`
        }
    }

    duplicateLambdas(lambda, params, values) {
        // console.log("duplicateLambdas", lambda, params, values)
        // console.log(this.functions[lambda].value)
        let dup = false
        for (const p of params) {
            if (this.functions[lambda].value.includes(p)) {
                dup = true 
                break
            }
        }
        if (dup) {
            this.lambda_counter++
            const new_lambda = `@${this.lambda_counter}`
            this.functions[new_lambda] = {
                parameters: this.functions[lambda].parameters,
                value: this.functions[lambda].value.slice(),
                string: this.functions[lambda].string,
            }
            for (let i = 0; i < this.functions[new_lambda].value.length; i++) {
                for (let j = 0; j < params.length; j++) {
                    if (this.functions[new_lambda].value[i] === params[j]) {
                        this.functions[new_lambda].value[i] = values[j]
                    }
                }
                if (this.functions[new_lambda].value[i] instanceof Operation && this.functions[new_lambda].value[i].op.startsWith("@")) {
                    const l = this.duplicateLambdas(this.functions[new_lambda].value[i].op, params, values)
                    if (l) {
                        this.functions[new_lambda].value[i] = l
                    }
                }
            }
            return new Operation(new_lambda)
        } else {
            for (let i = 0; i < this.functions[lambda].value.length; i++) {
                if (this.functions[lambda].value[i] instanceof Operation && this.functions[lambda].value[i].op.startsWith("@")) {
                    duplicateLambdas(this.functions[lambda].value[i].op, params, values)
                }
            }
            return null
        }
    }

    // Evaluate numerical result from tokens
    evaluate(tokens, options = {}) {
        // ("evaluate", JSON.stringify(tokens), options)
        this.overflow_count++
        if (this.overflow_count > this.overflow_max) {
            return "Overflow error: too many function calls"
        }
        // console.log("evaluate", tokens)
        // Replace ans with value
        if (typeof this.ans !== "string") {
            for (let t = 0; t < tokens.length; t++) {
                if (tokens[t] === "ans" ) {
                    tokens[t] = this.ans
                }
                // Parameter context
                if (tokens[t] in this.parameter_context) {
                    tokens[t] = this.parameter_context[tokens[t]]
                } else if (tokens[t] in this.variables) {
                    tokens[t] = this.variables[tokens[t]]
                }
            }
        }
        // Create array where index represents level of parenthesis and value represents frequency
        const parentheses = []
        const brackets = []
        for (const t of tokens) {
            if (typeof t === "string" && t[0] === "(") {
                parentheses[+t.slice(1) - 1] = parentheses[+t.slice(1) - 1] ? parentheses[+t.slice(1) - 1] + 1 : 1
            }
            if (typeof t === "string" && t[0] === "[") {
                brackets[+t.slice(1) - 1] = brackets[+t.slice(1) - 1] ? brackets[+t.slice(1) - 1] + 1 : 1
            }
        }
        // Loop through each level of brackets in descending order
        for (let i = brackets.length - 1; i >= 0; i--) {
            // Loop through frequency of each level
            for (let j = 0; j < brackets[i]; j++) {
                for (let t = 0; t < tokens.length; t++) {
                    if (tokens[t] === `[${i + 1}`) {
                        const close = tokens.indexOf(`]${i + 1}`)
                        // Empty brackets
                        if (close - t === 1) {
                            tokens.splice(t, close - t + 1, [])
                            break
                        }
                        const array = this.initializeArray(tokens.slice(t + 1, close))
                        if (typeof array === "string") {
                            return array
                        } else {
                            tokens.splice(t, close - t + 1, array)
                        }
                        break
                    }
                }
            }
        }
         // Loop through each level of parentheses in descending order
        for (let i = parentheses.length - 1; i >= 0; i--) {
            for (let j = 0; j < parentheses[i]; j++) {
                for (let t = 0; t < tokens.length; t++) {
                    if (tokens[t] === `(${i + 1}`) {
                        const close = tokens.indexOf(`)${i + 1}`)
                        if (close - t === 1) {
                            // Previous token is math function, () => []
                            if (t > 0 && isMathFunction(tokens[t - 1]) || tokens[t - 1] in this.functions) {
                                tokens.splice(t, close - t + 1, new Paren([]))
                            }
                        } else if (tokens.slice(t + 1, close).includes(",")) {
                            const ts = tokens.slice(t + 1, close)
                            for (let i = 0; i < ts.length; i++) {
                                if (ts[i] instanceof Paren) {
                                    if (i > 0 && Array.isArray(ts[i - 1])) {
                                        const result = this.evaluateSingle([ts[i - 1], ts[i]])
                                        ts.splice(i - 1, 2, result)
                                    }
                                }
                            }
                            const array = this.initializeArray(ts)
                            if (typeof array === "string") {
                                return array
                            } 
                            tokens.splice(t, close - t + 1, new Paren(array))
                        } else {
                            // Evaluate expression inside parentheses
                            const result = this.evaluateSingle(tokens.slice(t + 1, close))
                            if (typeof result === "string") {
                                return result      
                            }
                            if (result instanceof Operation && result.op !== ":") {
                                tokens.splice(t, close - t + 1, result)
                            } else {
                                tokens.splice(t, close - t + 1, new Paren([result]))
                            }
                        }
                        break
                    }
                }
            }
        }
        // No parentheses left
        // Single expression to be evaluated
        let final_result = this.evaluateSingle(tokens)
        if (typeof final_result !== "string" && !options?.noAns) {
            this.ans = final_result
        } 
        if (options.no_fraction && final_result instanceof Fraction) {
            final_result = final_result.value()
        }
        if (options.no_base_number && final_result instanceof BaseNumber) {
            final_result = final_result.value()
        }
        if (options.no_unit_number && final_result instanceof UnitNumber) {
            final_result = final_result.value()
        }
        if (options.noRound) {
            return final_result
        }
        if (typeof final_result === "number") {
            return set_precision(final_result, this.digits)
        } else if (Array.isArray(final_result)) {
            if (final_result.length > 50) {
                return JSON.stringify(roundArray(structuredClone(final_result.slice(0, 25)), this.digits)).replaceAll('"', "").replaceAll(",", ", ").slice(0, -1) + ", ..., " + JSON.stringify(roundArray(structuredClone(final_result.slice(-25)), this.digits)).replaceAll('"', "").replaceAll(",", ", ").slice(1)
            } else {
                let str = JSON.stringify(roundArray(structuredClone(final_result), this.digits)).replaceAll(",", ", ").replaceAll('"', "")
                if (str[1] !== "[") {
                    return str
                }
                let count = 0
                for (let i = 0; i < str.length; i++) {
                    if (str[i] === "[") {
                        count += 1
                    }
                    if (str[i] == "]") {
                        count -= 1
                    }
                    if (str[i - 1] == "]" && str[i] == ",") {
                        str = str.slice(0, i + 1) + "\n" + " ".repeat(count) + str.slice(i + 2)
                        i += count
                    }
                }
                return str
            }
        } else if (final_result instanceof Operation && final_result in calculator.functions) {
            let op = final_result.op
            let fs = calculator.functions[op].string
            if (fs.length > 0 && fs[0] === "@") {
                fs = fs.replace("@", "#")
            }
            while (fs.includes("@")) {
                const index = fs.lastIndexOf("@")
                let name = fs.slice(fs.lastIndexOf("@"))
                if (name.indexOf(")") !== -1) {
                    name = name.slice(0, name.indexOf(")"))
                }
                fs = fs.slice(0, index) + calculator.functions[name].string.replace("@", "#") + fs.slice(index + name.length)
            }
            fs = fs.replaceAll("#", "@")
            return new String(fs)
        } else {
            return final_result
        }
    }

    // Evaluate expression without parentheses
    evaluateSingle(tokens) {
        // console.log("evaluateSingle", JSON.stringify(tokens))
        if (tokens.length > 1) {
            // Index
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i] instanceof Paren) {
                    if (i > 0 && Array.isArray(tokens[i - 1])) {
                        const A = tokens[i - 1]
                        tokens.splice(i - 1, 2, "index", new Paren([A, tokens[i].tokens]))
                    }
                }
            }
            // Count number of math functions
            let function_count = 0
            for (const t of tokens) {
                if (typeof t === "string" && (isMathFunction(t) || t in this.functions)) {
                    function_count++
                }
            }

            while (function_count) {
                // Evaluate math functions
                for (let i = 0; i < tokens.length; i++) {
                    if (typeof tokens[i] === "string" && (isMathFunction(tokens[i]) || tokens[i] in this.functions)) {
                        tokens = tokens[i] in this.functions ? this.evaluateFunction(tokens, i) : this.operate(tokens, i)
                        if (typeof tokens === "string") {
                            return tokens
                        }
                        if (tokens[i] instanceof Operation && tokens.length > 1) {
                            tokens[i] = tokens[i].op
                            i--
                        }
                    }
                }
                // Unwrap Paren
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i] instanceof Paren) {
                        if (i > 0 && Array.isArray(tokens[i - 1])) {
                            const A = tokens[i - 1]
                            tokens.splice(i - 1, 2, "index", new Paren([A, tokens[i].tokens]))
                            // console.log("index", tokens)
                        } else if (tokens[i].tokens.length === 0 && is_multipliable(tokens[i].tokens[0])) {
                            tokens[i] = tokens[i].tokens[0]
                        }
                    }
                }
                // Recount
                let calc_function_count = 0
                for (const t of tokens) {
                    if (typeof t === "string" && (isMathFunction(t) || t in this.functions)) {
                        calc_function_count++
                    }
                }
                function_count = calc_function_count
            }

            // Add multiplication signs between adjacent numbers
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i] instanceof Paren) {
                    if (tokens[i].tokens.length === 1 && is_multipliable(tokens[i].tokens[0])) {
                        tokens[i] = tokens[i].tokens[0]
                    }
                }
            }
            for (let t = 0; t < tokens.length - 1; t++) {
                if (is_multipliable(tokens[t]) && is_multipliable(tokens[t + 1])) {
                    tokens.splice(t + 1, 0, "*")
                }
            }


            if (tokens.length > 1 && tokens.filter((x) => x instanceof Operation).length > 0) {
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i] instanceof Operation) {
                        tokens[i] = tokens[i].op
                        break
                    }
                }
                tokens = this.evaluateSingle(tokens)
                if (typeof tokens === "string") {
                    return tokens
                }
                tokens = [tokens]
            }
            
            // Evaluate operators
            while (tokens.length > 1) {
                tokens = this.evaluateOperator(tokens)
                if (typeof tokens === "string") {
                    return tokens
                }
            }
        }

        if (tokens[0] instanceof Paren) {
            if (tokens[0].tokens.length != 1) {
                return "Parentheses error"
            } else {
                tokens[0] = tokens[0].tokens[0]
            }
        }

        // One token to evaluate
        if (typeof tokens[0] === "number" || tokens[0] instanceof Fraction || Array.isArray(tokens[0]) || tokens[0] instanceof String || tokens[0] instanceof Operation || typeof tokens[0] === "boolean" || tokens[0] instanceof BaseNumber || tokens[0] instanceof UnitNumber) {
            return tokens[0]
        } else if (CONSTANTS.includes(tokens[0])) {
            return OPERATIONS[tokens[0]].func()
        } else if (tokens[0] in OPERATIONS) {
            return new Operation(tokens[0])
        } else if (tokens[0] in this.functions) {
            return new String(this.functions[tokens[0]].string)
        } else {
            return "Error"
        }
    }

    // Evaluate expression with operator/symbol
    evaluateOperator(tokens) {
        for (let t = 0; t < tokens.length - 1; t++) {
            if (is_multipliable(tokens[t]) && is_multipliable(tokens[t + 1])) {
                tokens.splice(t + 1, 0, "*")
            }
        }
        // console.log("evaluateOperator", tokens)
        // Filter order of operations array so only used operations are present
        let used_operations = ORDER_OF_OPERATIONS.map(list => list.filter(e => tokens.includes(e))).filter(e => e.length)
        // console.log("evaluateOperator", tokens, used_operations)
        if (used_operations.length) {
            // Loop through lists in used operations
            for (let i = 0; i < used_operations.length; i++) {
                // Loop through tokens
                for (let index = 0; index < tokens.length; index++) {
                    // Loop through elements of lists
                    for (let j = 0; j < used_operations[i].length; j++) {
                        if (tokens[index] === used_operations[i][j]) {
                            return this.operate(tokens, index)
                        }
                    }
                }
            }
        } else {
            // console.log("evaluateOperator error")
            return "Execution error"
        }
    }

    // Perform operation given tokens and index
    operate(tokens, index, options) {
        // console.log("operate", tokens, index)
        let operation = OPERATIONS[tokens[index]]
        try {
            // Create parameters
            let params = operation.schema.map((i) => tokens[i + index])
            for (let i = 0; i < params.length; i++) {
                if (params[i] instanceof Paren) {
                    if (params[i].tokens.length > 1 && LIST_OPERATIONS.includes(tokens[index])) {
                        params.splice(i, 1, params[i].tokens) 
                    } else {
                        params.splice(i, 1, ...params[i].tokens) 
                    }
                }
            }
            if (LIST_OPERATIONS.includes(tokens[index]) && params.length === 1 && !Array.isArray(params[0])) {
                params = [params]
            }
            if (params.length > operation.types.length) {
                return `${operation.name} error > type error: expected ${operation.types.length} parameter${operation.types.length !== 1 ? "s" : ""} but received ${params.length} parameters`
            }
            let param_types = get_param_types(params)
            if (!check_param_types(param_types, operation.types)) {
                // Try negation if parameter error for subtraction
                let fail = true
                if (tokens[index] === "-") {
                    operation = OPERATIONS["neg"]
                    params = operation.schema.map((i) => tokens[i + index])
                    param_types = get_param_types(params)
                    if (check_param_types(param_types, operation.types)) {
                        fail = false
                    }
                }
                if (tokens[index] === "to") {
                    operation = OPERATIONS["to2"]
                    params = operation.schema.map((i) => tokens[i + index])
                    param_types = get_param_types(params)
                    if (check_param_types(param_types, operation.types)) {
                        fail = false
                    }
                }
                if (UNITS.includes(tokens[index])) {
                    if (!(tokens[index] instanceof Operation)) {
                        tokens[index] = new Operation(tokens[index])
                    }
                    return tokens
                }
                if (tokens[index] === ":") {
                    operation = OPERATIONS[":2"]
                    params = operation.schema.map((i) => tokens[i + index])
                    param_types = get_param_types(params)
                    // console.log(":2", params)
                    if (!check_param_types(param_types, operation.types)) {
                        operation = OPERATIONS[":3"]
                        params = operation.schema.map((i) => tokens[i + index])
                        param_types = get_param_types(params)
                        // console.log(":3", params)
                        if (check_param_types(param_types, operation.types)) {
                            fail = false
                        }
                    } else {
                        fail = false
                    }
                }
                if (["^", "*", "/"].includes(tokens[index])) {
                    if (index < tokens.length - 2 && tokens[index + 1] == "-" && typeof tokens[index + 2] == "number") {
                        const v = -tokens[index + 2]
                        tokens.splice(index + 1, 2, v)
                        params = operation.schema.map((i) => tokens[i + index])
                        fail = false
                    }
                }
                if (fail) {
                    return `${operation.name} error > type error: expected "${operation.types.join(", ")}" but received "${param_types.join(", ")}"`
                }
            }

            // Convert angle for angle functions
            if (ANGLE_FUNCTIONS.includes(tokens[index]) && this.angle === "deg") {
                params = params.map((n) => n * Math.PI / 180)
            }
            // Offset required if first parameter negative/before index
            const offset = operation.schema[0] < 0 ? operation.schema[0] : 0
            if (!operation.allow_fractions) {
                params = params.map((n) => n instanceof Fraction ? n.value() : n)
            }
            if (!operation.allow_units) {
                params = params.map((n) => n instanceof UnitNumber ? n.value() : n)
            }
            if (!operation.allow_base_numbers) {
                params = params.map((n) => n instanceof BaseNumber ? convert_to_decimal(n) : n)
            }
            let result
            if (operation.calc) {
                result = operation.func(...params, this)
            } else {
                result = operation.func(...params)
            }
            if (typeof result === "string") {
                return `${operation.name} error > ${result}`
            }
            if (this.debug && !SYMBOLS.includes(tokens[index]) && !["eval_if", "index"].includes(tokens[index])) {
                const result_string = this.evaluate([result], { noAns: true })
                let debug_params = []
                for (const p of params) {
                    if (typeof p === "object" && p.cond) {
                        // console.log("skip")
                    } else {
                        debug_params.push(this.evaluate([p], { noAns: true }))
                    }
                }
                this.debug_log.push([this.debug_depth, `${tokens[index]}(${debug_params.join(", ")}) -> ${result_string}`])
            }
            if (result instanceof Fraction && result.invalid) {
                if (result.invalid === "0/0") {
                    return `Invalid fraction`
                } else if (result.invalid === "/0") {
                    result = result.value()
                }
            }
            if (typeof result === "number" && isNaN(result)) {
                return `${operation.name} error > NaN error`
            }
            // Angle inverse function
            if (ANGLE_INVERSE_FUNCTIONS.includes(tokens[index]) && this.angle === "deg") {
                result = result * 180 / Math.PI
            }
            // Delete old tokens and insert result token
            tokens.splice(index + offset, operation.schema.length + 1, result)
            return tokens
        } catch (err) {
            // console.log(err)
            return `${operation.name} error > execution error`
        }
    }

    // Calculate numerical result from raw expression
    calculate(expression, options = {}) {
        if (!options.keep_debug) {
            this.debug_log = []
            this.debug = false
            this.debug_depth = 0
        }
        // console.log("calculate", expression)
        if (options.debug) {
            this.debug = true
        }
        this.overflow_count = 0
        let result
        expression = expression.split(";")
        for (const e of expression) {
            if (e.length === 0) continue
            const tokens = this.parse(e)
            // console.log("parse", tokens)
            if (Array.isArray(tokens)) {
                result = this.evaluate(tokens, options)
            } else {
                result = tokens
            }
        }
        if (this.debug && !options.get_result) {
            let debug_output = ""
            for (let i = 0; i < this.debug_log.length; i++) {
                let e = this.debug_log[i]
                if (i === this.debug_log.length - 1 || !this.debug_log[i + 1][1].includes(e[1])) {
                    for (let j = 0; j < e[0]; j++) {
                        debug_output += "|  "
                    }
                    debug_output += e[1]
                    debug_output += "\n"
                }
            }
            result = debug_output || "N/A"
        }
        return result
    }
}