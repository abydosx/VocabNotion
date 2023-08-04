import { postData } from "./fetch";
import { 
  QueryDatabaseBodyParameters, 
  QueryDatabaseResponse, 
  UpdatePageParameters, 
  UpdatePageResponse
} from '@/types/notion';

// TODO:
const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://vercel-api-pink.vercel.app'

export const notionPages = (params: QueryDatabaseBodyParameters) => postData<QueryDatabaseResponse>(`${baseUrl}/notion/pages`, params)

export const updatePage = (params: UpdatePageParameters) => postData<UpdatePageResponse>(`${baseUrl}/notion/updatePage`, params)
