export const baseTimezoneField = ({ name, defaultValue, options, required })=>{
    return {
        name: name,
        type: 'select',
        admin: {
            hidden: true
        },
        defaultValue,
        options: options,
        required
    };
};

//# sourceMappingURL=baseField.js.map