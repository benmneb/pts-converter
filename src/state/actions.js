export function setNavTab(tab) {
  return {
    type: 'SET_NAV_TAB',
    tab,
  };
}

export function selectBook(book) {
  return {
    type: 'SELECT_BOOK',
    book,
  };
}

export function selectDivision(division) {
  return {
    type: 'SELECT_DIVISION',
    division,
  };
}

export function selectPage(page) {
  return {
    type: 'SELECT_PAGE',
    page,
  };
}

export function handleInputChange(text) {
  return {
    type: 'HANDLE_INPUT_CHANGE',
    text,
  };
}

export function resetInputValues() {
  return {
    type: 'RESET_INPUT_VALUES',
  };
}

export function setSearchResults(book, division, page, text) {
  return {
    type: 'SET_SEARCH_RESULTS',
    book,
    division,
    page,
    text,
  };
}

export function setMultipleEditionSearchResults(results, text) {
  return {
    type: 'SET_MULTIPLE_EDITION_SEARCH_RESULTS',
    results,
    text,
  };
}

export function setError(message) {
  return {
    type: 'SET_ERROR',
    message,
  };
}

export function clearInput() {
  return {
    type: 'CLEAR_INPUT',
  };
}

export function toggleSnackbar() {
  return {
    type: 'TOGGLE_SNACKBAR',
  };
}
