import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  const compare = createComparison({
    skipEmptyTargetValues: true,
    rules: [
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller", "total"],
        false,
      ),
    ],
  });

  return (data, state, action) => {
    if (
      action &&
      action.name === "clear" &&
      action.dataset.field === searchField
    ) {
      const parent = action.closest(".filter-group") || action.parentElement;
      const inputField = parent.querySelector("input");
      if (inputField) {
        inputField.value = "";
      }
      state[searchField] = "";
    }

    const searchValue = state[searchField];

    if (!searchValue || !searchValue.trim()) {
      return data;
    }

    return data.filter((row) => compare(row, { [searchField]: searchValue }));
  };
}
