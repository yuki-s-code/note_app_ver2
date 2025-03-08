import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import type { RootState } from "../libs/app/store";
import {
  CREATEISMODAL,
  BOARD,
  ACTIVETOOLTIP,
  SEARCHBOARD,
  EDITEDBOARD,
  COMMENT,
  NEWBOARD,
} from "../libs/types/board";

export interface BoardState {
  boardList: BOARD;
  newBoardList: NEWBOARD;
  editedBoardList: EDITEDBOARD;
  commentList: COMMENT;
  newBoardModal: CREATEISMODAL;
  editedBoardModal: CREATEISMODAL;
  createCommentModal: CREATEISMODAL;
  activeToolTip: ACTIVETOOLTIP;
  searchBoard: SEARCHBOARD;
}
const initialState: BoardState = {
  boardList: {
    display: true,
    contents: "",
    comment: [],
    user: window.localStorage.sns_id,
    tag: "",
    favorite: [],
    createdAt: "",
    updatedAt: "",
  },
  newBoardList: {
    display: true,
    contents: "",
    comment: [],
    user: window.localStorage.sns_id,
    tag: "",
  },
  editedBoardList: {
    _id: "",
    display: true,
    contents: "",
    comment: [],
    user: window.localStorage.sns_id,
    tag: "",
    favorite: [],
  },
  commentList: {
    id: "",
    contents: "",
    commenter: window.localStorage.sns_id,
    tag: "",
    createdAt: "",
    updatedAt: "",
  },
  newBoardModal: {
    open: false,
  },
  editedBoardModal: {
    open: false,
  },
  createCommentModal: {
    open: false,
  },
  activeToolTip: {
    name: null,
  },
  searchBoard: {
    name: "",
  },
};

export const BoardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoardList: (state, action: PayloadAction<BOARD>) => {
      state.boardList = action.payload;
    },
    resetBoardList: (state) => {
      state.boardList = initialState.boardList;
    },
    setNewBoardList: (state, action: PayloadAction<NEWBOARD>) => {
      state.newBoardList = action.payload;
    },
    resetNewBoardList: (state) => {
      state.newBoardList = initialState.newBoardList;
    },
    setEditedBoardList: (state, action: PayloadAction<EDITEDBOARD>) => {
      state.editedBoardList = action.payload;
    },
    resetEditedBoardList: (state) => {
      state.editedBoardList = initialState.editedBoardList;
    },
    setCommentList: (state, action: PayloadAction<COMMENT>) => {
      state.commentList = action.payload;
    },
    resetCommentList: (state) => {
      state.commentList = initialState.commentList;
    },
    setNewBoardModal: (state, action: PayloadAction<CREATEISMODAL>) => {
      state.newBoardModal = action.payload;
    },
    resetNewBoardModal: (state) => {
      state.newBoardModal = initialState.newBoardModal;
    },
    setEditedBoardModal: (state, action: PayloadAction<CREATEISMODAL>) => {
      state.editedBoardModal = action.payload;
    },
    resetEditedBoardModal: (state) => {
      state.editedBoardModal = initialState.editedBoardModal;
    },
    setCreateCommentModal: (state, action: PayloadAction<CREATEISMODAL>) => {
      state.createCommentModal = action.payload;
    },
    resetCreateCommentModal: (state) => {
      state.createCommentModal = initialState.createCommentModal;
    },
    setActiveToolTip: (state, action: PayloadAction<ACTIVETOOLTIP>) => {
      state.activeToolTip = action.payload;
    },
    resetActiveToolTip: (state) => {
      state.activeToolTip = initialState.activeToolTip;
    },
    setSearchBoard: (state, action: PayloadAction<SEARCHBOARD>) => {
      state.searchBoard = action.payload;
    },
    resetSearchBoard: (state) => {
      state.searchBoard = initialState.searchBoard;
    },
  },
});

export const {
  setBoardList,
  resetBoardList,
  setNewBoardList,
  resetNewBoardList,
  setEditedBoardList,
  resetEditedBoardList,
  setNewBoardModal,
  resetNewBoardModal,
  setEditedBoardModal,
  resetEditedBoardModal,
  setCreateCommentModal,
  resetCreateCommentModal,
  setCommentList,
  resetCommentList,
  setActiveToolTip,
  resetActiveToolTip,
  setSearchBoard,
  resetSearchBoard,
} = BoardSlice.actions;

export const selectBoardList = (state: RootState) => state.board.boardList;
export const selectNewBoardList = (state: RootState) =>
  state.board.newBoardList;
export const selectCommentList = (state: RootState) => state.board.commentList;
export const selectEditedBoardList = (state: RootState) =>
  state.board.editedBoardList;
export const selectNewBoardModal = (state: RootState) =>
  state.board.newBoardModal;
export const selectEditedBoardModal = (state: RootState) =>
  state.board.editedBoardModal;
export const selectCreateCommentModal = (state: RootState) =>
  state.board.createCommentModal;
export const selectActiveToolTip = (state: RootState) =>
  state.board.activeToolTip;
export const selectSearchBoard = (state: RootState) => state.board.searchBoard;

export default BoardSlice.reducer;
