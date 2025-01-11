import { executeScriptOnActiveTab } from './executeScriptOnActiveTab.js';

export const applyFilters = async (filterString) => {
    document.body.setAttribute('data-filter', filterString);

    await executeScriptOnActiveTab((filter) => {
        document.body.style.filter = filter;
    }, filterString);
};
