import create from 'zustand';

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

export const useStore = create((set) => ({
  ...initialState,

  setNavTab: (navTab) =>
    set((state) => ({
      ...state,
      navTab,
      selectedBook: initialState.selectedBook,
      selectedDivision: initialState.selectedDivision,
      selectedPage: initialState.selectedPage,
      multipleEditionResults: initialState.multipleEditionResults,
      inputText: initialState.inputText,
    })),

  selectBook: (selectedBook) =>
    set((state) => ({
      ...state,
      selectedBook,
      selectedDivision: initialState.selectedDivision,
      selectedPage: initialState.selectedPage,
    })),

  selectDivision: (selectedDivision) =>
    set((state) => ({
      ...state,
      selectedDivision,
      selectedPage: initialState.selectedPage,
    })),

  selectPage: (selectedPage) =>
    set((state) => ({
      ...state,
      selectedPage,
      inputText: initialState.inputText,
      multipleEditionResults: initialState.multipleEditionResults,
    })),

  handleInputChange: (inputText) =>
    set((state) => ({
      ...state,
      inputText,
      isError: false,
    })),

  resetInputValues: () =>
    set((state) => ({
      ...state,
      selectedBook: initialState.selectedBook,
      selectedDivision: initialState.selectedDivision,
      selectedPage: initialState.selectedPage,
      multipleEditionResults: initialState.multipleEditionResults,
    })),

  setSearchResults: (selectedBook, selectedDivision, selectedPage, inputText) =>
    set((state) => ({
      ...state,
      selectedBook,
      selectedDivision,
      selectedPage,
      inputText,
      isError: false,
      multipleEditionResults: initialState.multipleEditionResults,
    })),

  setMultipleEditionSearchResults: (multipleEditionResults, inputText) =>
    set((state) => ({
      ...state,
      multipleEditionResults,
      inputText,
      isError: false,
    })),

  setError: (errorMessage) =>
    set((state) => ({
      ...state,
      isError: true,
      errorMessage,
    })),

  clearInput: () =>
    set((state) => ({
      ...state,
      isError: false,
      inputText: initialState.inputText,
      selectedBook: initialState.selectedBook,
      selectedDivision: initialState.selectedDivision,
      selectedPage: initialState.selectedPage,
      multipleEditionResults: initialState.multipleEditionResults,
    })),

  toggleSnackbar: () =>
    set((state) => ({
      ...state,
      showSnackbar: !state.showSnackbar,
    })),

  setDeferredInstallPrompt: (deferredInstallPrompt) =>
    set((state) => ({
      ...state,
      deferredInstallPrompt,
    })),
}));
