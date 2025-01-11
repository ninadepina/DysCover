import { executeScriptOnActiveTab } from './executeScriptOnActiveTab.js';

export const applyFilters = async (filterString) => {
    await executeScriptOnActiveTab((filter) => {
        document.body.style.filter = filter;
    }, filterString);
};
