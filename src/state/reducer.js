const initialState = {
  selectedBook: '',
  selectedDivision: '',
  selectedPage: '',
  multipleEditionResults: null,
  navTab: 0,
  inputText: '',
  isError: false,
  errorMessage: null,
  showSnackbar: false,
  deferredInstallPrompt: null,
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_NAV_TAB':
      return {
        ...state,
        navTab: action.tab,
        selectedBook: initialState.selectedBook,
        selectedDivision: initialState.selectedDivision,
        selectedPage: initialState.selectedPage,
        multipleEditionResults: initialState.multipleEditionResults,
        inputText: initialState.inputText,
      };
    case 'SELECT_BOOK':
      return {
        ...state,
        selectedBook: action.book,
        selectedDivision: initialState.selectedDivision,
        selectedPage: initialState.selectedPage,
      };
    case 'SELECT_DIVISION':
      return {
        ...state,
        selectedDivision: action.division,
        selectedPage: initialState.selectedPage,
      };
    case 'SELECT_PAGE':
      return {
        ...state,
        selectedPage: action.page,
        inputText: initialState.inputText,
        multipleEditionResults: initialState.multipleEditionResults,
      };
    case 'HANDLE_INPUT_CHANGE':
      return {
        ...state,
        inputText: action.text,
        isError: false,
      };
    case 'RESET_INPUT_VALUES':
      return {
        ...state,
        selectedBook: initialState.selectedBook,
        selectedDivision: initialState.selectedDivision,
        selectedPage: initialState.selectedPage,
        multipleEditionResults: initialState.multipleEditionResults,
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        selectedBook: action.book,
        selectedDivision: action.division,
        selectedPage: action.page,
        inputText: action.text,
        isError: false,
        multipleEditionResults: initialState.multipleEditionResults,
      };
    case 'SET_MULTIPLE_EDITION_SEARCH_RESULTS':
      return {
        ...state,
        multipleEditionResults: action.results,
        inputText: action.text,
        isError: false,
      };
    case 'SET_ERROR':
      return {
        ...state,
        isError: true,
        errorMessage: action.message,
      };
    case 'CLEAR_INPUT':
      return {
        ...state,
        inputText: initialState.inputText,
        isError: false,
        selectedBook: initialState.selectedBook,
        selectedDivision: initialState.selectedDivision,
        selectedPage: initialState.selectedPage,
        multipleEditionResults: initialState.multipleEditionResults,
      };
    case 'TOGGLE_SNACKBAR':
      return {
        ...state,
        showSnackbar: !state.showSnackbar,
      };
    case 'SET_DEFERRED_INSTALL_PROMPT':
      return {
        ...state,
        deferredInstallPrompt: action.prompt,
      };
    default:
      return state;
  }
}
