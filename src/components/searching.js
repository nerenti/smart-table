import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const compare = createComparison(
    ['skipEmptyTargetValues'],  // первый аргумент - массив имен правил
    [                           // второй аргумент - массив пользовательских правил
      rules.searchMultipleFields(
        searchField,
        ['date', 'customer', 'seller'],
        false
      )
    ]
  );

  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    
    const searchValue = state[searchField];
    
    if (!searchValue || searchValue.trim() === '') {
      return data;
    }
    
    return data.filter(row => compare(row, { [searchField]: searchValue }));
  };
}