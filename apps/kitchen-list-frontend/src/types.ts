export interface ISuggestionListItem {
  name: string;
  id: number;
}

export interface IListItem extends ISuggestionListItem {
  completed: boolean;
}

export interface ICategory {
  name: string;
  id: number;
}

export interface IShopListItem {
  id: number;
  name: string;
  date: Date;
  comleted: boolean;
}
