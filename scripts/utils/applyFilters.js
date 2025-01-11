import { executeScriptOnActiveTab } from './executeScriptOnActiveTab.js';

export const applyFilters = async (filterString) => {
    try {
        document.body.setAttribute('data-filter', filterString);

        await executeScriptOnActiveTab((filter) => {
            document.body.style.filter = filter;
        }, filterString);
    } catch (err) {
        return;
    }
};
