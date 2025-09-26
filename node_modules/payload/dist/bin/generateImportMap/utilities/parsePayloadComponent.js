export function parsePayloadComponent(PayloadComponent) {
    if (!PayloadComponent) {
        return null;
    }
    const pathAndMaybeExport = typeof PayloadComponent === 'string' ? PayloadComponent : PayloadComponent.path;
    let path = '';
    let exportName = 'default';
    if (pathAndMaybeExport?.includes('#')) {
        ;
        [path, exportName] = pathAndMaybeExport.split('#');
    } else {
        path = pathAndMaybeExport;
    }
    if (typeof PayloadComponent === 'object' && PayloadComponent.exportName) {
        exportName = PayloadComponent.exportName;
    }
    return {
        exportName: exportName,
        path: path
    };
}

//# sourceMappingURL=parsePayloadComponent.js.map