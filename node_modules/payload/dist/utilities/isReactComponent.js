const clientRefSymbol = Symbol.for('react.client.reference');
export function isReactServerComponentOrFunction(component) {
    if (component === null || component === undefined) {
        return false;
    }
    const hasClientComponentSymbol = component.$$typeof == clientRefSymbol;
    const isFunctionalComponent = typeof component === 'function';
    // Anonymous functions are Client Components in Turbopack. RSCs should have a name
    const isAnonymousFunction = typeof component === 'function' && component.name === '';
    const isRSC = isFunctionalComponent && !isAnonymousFunction && !hasClientComponentSymbol;
    return isRSC;
}
export function isReactClientComponent(component) {
    if (component === null || component === undefined) {
        return false;
    }
    return !isReactServerComponentOrFunction(component) && component.$$typeof == clientRefSymbol;
}
export function isReactComponentOrFunction(component) {
    return isReactServerComponentOrFunction(component) || isReactClientComponent(component);
}

//# sourceMappingURL=isReactComponent.js.map