export function createArrayFromCommaDelineated(input) {
    if (Array.isArray(input)) {
        return input;
    }
    if (input.indexOf(',') > -1) {
        return input.split(',');
    }
    return [
        input
    ];
}

//# sourceMappingURL=createArrayFromCommaDelineated.js.map