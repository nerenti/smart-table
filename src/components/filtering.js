import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules); // @todo: #4.3 — настроить компаратор

export function initFiltering(elements, indexes) {
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  Object.values(elements).forEach((element) => {
    if (element) {
      element.value = "";
    }
  }); // @todo: #4.1 — заполнить выпадающие списки опциями

  return (data, state, action) => {
    if (action && action.name === "clear") {
      const parent = action.closest(".filter-group") || action.parentElement;

      const inputField = parent.querySelector("input");

      if (inputField) {
        inputField.value = "";

        const fieldName = action.dataset.field;

        if (fieldName && state[fieldName] !== undefined) {
          state[fieldName] = "";
        }
      }
    } // @todo: #4.2 — обработать очистку поля

    return data.filter(row => compare(row, state)); // @todo: #4.5 — отфильтровать данные используя компаратор
    return data;
  };
}
