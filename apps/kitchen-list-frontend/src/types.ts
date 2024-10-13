export interface ISuggestionListItem {
  name: string;
  id: number;
}

export interface IListItem extends ISuggestionListItem {
  actual: boolean;
}

export interface ICategory {
  name: string;
  id: number;
}
