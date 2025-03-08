export interface USER {
  userid: string;
  hash: string;
  token: string;
  active: boolean;
  profile: string;
  profiledetail: string;
}

export interface CREATEUSER {
  userid: string;
  passwd: string;
}

export interface LOGINUSER {
  userid: string;
  passwd: string;
}

export interface LOGINMIGRATIONS {
  msg: string;
  token: string;
}
