import {Content} from "./messages";

export interface UserDetail {
  sessions: number;
  ts: number;
  rooms?: string[];
  groups?: string[];
  installs?: string[];
  friends?: string[];
  attributes?: { [key: string]: any };
}

export interface UserOutline {
  id: string;
  online: boolean;
  ts: number;
  attributes?: { [key: string]: any };
}

export interface GroupInfo {
  id: string;
  owner: string;
  members: string[];
  ts: number;
  attributes?: { [key: string]: any };
}

export interface MyGroup extends GroupInfo {
  recent?: ChatRecord;
}

export interface RoomInfo {
  id: string;
  members: string[];
  ts: number;
  attributes?: { [key: string]: any };
}

export interface ChatRecord {
  speaker: string;
  content: Content;
  ts: number;
  remark?: string;
}

export interface Friend {
  id: string;
  online: boolean;
  recent?: ChatRecord;
}

export interface Passenger {
  [key: string]: any;
}

export interface Attributes {
  [key: string]: any;
}

export class APIOptions {
  public server: string;
  public app: string;
  public sign: string;
  public headers: { [key: string]: string };

  constructor(server: string, app: string, sign: string) {
    this.server = server;
    this.app = app;
    this.sign = sign;
    this.headers = {
      "x-ml-appid": app,
      "x-ml-apikey": sign,
      "content-type": "application/json; charset=utf-8",
    };
  }
}

export type Handler1<T> = (t?: T) => void;
export type Handler2<T, U> = (t?: T, u?: U) => void;
export type Handler3<T, U, V> = (t?: T, u?: U, v?: V) => void;
export type Callback<T> = (err?: Error, t?: T) => void;
export type Callback2<T, U> = (err?: Error, t?: T, u?: U) => void;

export interface LoginResult {
  success: boolean;
  id?: string;
  error?: number;
}
