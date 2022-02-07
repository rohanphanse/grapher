// console.log(math)

class Utility {
    static round(number, precision = 8) {
        return Math.round(number * 10**precision) / 10**precision
    }
}

