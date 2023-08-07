import { PageObjectResponse, RichTextItemResponse, QueryDatabaseResponse } from './notion';
declare global {
  declare type NotionWordInfo = PageObjectResponse
  declare type FormatContent = {
    zh: string
    en: string
    richTextEn: RichTextItemResponse[]
  }

  declare NotionResults = QueryDatabaseResponse['results']
}

export { }
