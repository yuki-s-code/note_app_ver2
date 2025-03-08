export interface BOARD {
  display: boolean;
  contents: any;
  comment: any;
  user: any;
  tag: any;
  favorite: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NEWBOARD {
  display: boolean;
  contents: any;
  comment: any;
  user: any;
  tag: any;
}

export interface EDITEDBOARD {
  _id: string;
  display: boolean;
  contents: any;
  comment: any;
  favorite: string[];
  user: any;
  tag: any;
}

export interface COMMENT {
  id: any,
  contents: any,
  tag: any;
  commenter: string,
  createdAt: string,
  updatedAt: string,
}

export interface CREATEISMODAL {
  open: boolean;
}

export interface SEARCHBOARD {
  name: any;
}

export interface ACTIVETOOLTIP {
  name: any;
}

export interface HASH {
  name: any,
  boardId: any,
}
