// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export interface BaseCategory<T extends Object = any> {
  title: string;
  id?: string | number;
  url: string;
  parent_id?: string;
  meta?: T
}