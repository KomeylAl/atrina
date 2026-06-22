export interface Root {
  name: string;
  type: string;
  properties: Properties;
  required: string[];
}

export interface Properties {
  title: Title;
  content: Content;
  excerpt: Excerpt;
  author: Author;
  publish_date: PublishDate;
  category: Category;
  tags: Tags;
  image_url: ImageUrl;
  read_time: ReadTime;
}

export interface Title {
  type: string;
  description: string;
}

export interface Content {
  type: string;
  description: string;
}

export interface Excerpt {
  type: string;
  description: string;
}

export interface Author {
  type: string;
  description: string;
}

export interface PublishDate {
  type: string;
  format: string;
  description: string;
}

export interface Category {
  type: string;
  enum: string[];
  description: string;
}

export interface Tags {
  type: string;
  items: Items;
  description: string;
}

export interface Items {
  type: string;
}

export interface ImageUrl {
  type: string;
  description: string;
}

export interface ReadTime {
  type: string;
  description: string;
}
