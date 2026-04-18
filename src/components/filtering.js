export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                elements[elementName].append(
                    ...Object.values(indexes[elementName]).map(name => {
                        const el = document.createElement('option');
                        el.textContent = name;
                        el.value = name;
                        return el;
                    })
                );
            }
        });
    }

    const applyFiltering = (query, state, action) => {
        if (action && action.name === "clear") {
            const parent = action.closest(".filter-group") || action.parentElement;
            const inputField = parent.querySelector("input");
            
            if (inputField) {
                inputField.value = "";
            }
        }
        
        const filter = {};
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && (element.tagName === 'INPUT' || element.tagName === 'SELECT')) {
                if (element.value && element.value !== '') {
                    filter[`filter[${element.name}]`] = element.value;
                }
            }
        });
        
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    }

    return {
        updateIndexes,
        applyFiltering
    }
}