import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initSearching} from "./components/searching.js";
import {initFiltering} from "./components/filtering.js";
import {initSorting} from "./components/sorting.js";
import {initPagination} from "./components/pagination.js";

const api = initData();

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;
    const page = parseInt(state.page ?? 1);
    const totalFrom = state.totalFrom ? parseFloat(state.totalFrom) : null;
    const totalTo = state.totalTo ? parseFloat(state.totalTo) : null;
    
    return {
        ...state,
        rowsPerPage,
        page,
        totalFrom,
        totalTo,
        total: [totalFrom, totalTo]
    };
}

async function render(action) {
    let state = collectState();
    let query = {};
    
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    
    const { total, items } = await api.getRecords(query);
    
    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applySearching = initSearching('search');

const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const {applyPagination, updatePagination} = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        if (input) input.value = page;
        if (input) input.checked = isCurrent;
        if (label) label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector('#app');
if (appRoot) {
    appRoot.appendChild(sampleTable.container);
}

async function init() {
    const indexes = await api.getIndexes();
    
    
    const sellerNames = Object.values(indexes.sellers);
    
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: sellerNames
    });
    
    render();
}

init();