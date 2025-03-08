//note.ts

export interface NOTEBLOCKS {
  id: string;
  contents: any;
  pageLinks: any;
  user: string;
}

export interface CREATEISMODAL {
  open: number;
}

export interface SEARCHNAME {
  name: any;
}

export interface COMPLEXTREEFOLDER {
  index: string,
  canMove: boolean
  isFolder: boolean,
  children: any,
  data: any,
  canRename: boolean,
  roots: boolean,
  bookmarks:any,
}

export interface COMPLEXTREENOTE {
  root: {
    index: string,
    canMove: boolean
    isFolder: boolean,
    children: any,
    data: any,
    canRename: boolean,
  },
}

export interface TREEIDGET {
  id: string,
}
//-----------------------------------------
export interface ITEMINDEX {
  index: string,
}

export interface TITLE_ID {
  index: string,
  dataItem: any
  dataIcon: any,
  dataImage: any,
  dataType: any,
}

export interface LIVEBLOCK {
  open: boolean
}

export interface MENTIONBLOCK {
  open: boolean
  mentionData: any,
  mentionType: any,
}

export interface APPDESIGN {
  appOpen: boolean
  appIndex: any
}
export interface MENTIONPEEK {
  peekDisplay: boolean
}

export interface CODESTATEITEM {
  id: string;
  code: string;
  language: string;
}

export interface SearchResult {
  id: string;
  title: string;
  icon: string;
  image: string;
  type: string;
  contents: any;
  updatedAt: Date;
}