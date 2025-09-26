/** Will read the `routes.admin` config and appropriately handle `"/"` admin paths */ export const formatAdminURL = (args)=>{
    const { adminRoute, basePath = '', path: pathFromArgs, serverURL } = args;
    const path = pathFromArgs || '';
    if (adminRoute) {
        if (adminRoute === '/') {
            if (!path) {
                return `${serverURL || ''}${basePath}${adminRoute}`;
            }
        } else {
            return `${serverURL || ''}${basePath}${adminRoute}${path}`;
        }
    }
    return `${serverURL || ''}${basePath}${path}`;
};

//# sourceMappingURL=formatAdminURL.js.map