/** Axios Response 通用型別
 * 適用於使用Axios Fetch API 資料時
 * 將客製的 Type 賦予於 @data
 */
export interface AxResponseType {
  config: object;
  data: unknown;
  headers: object;
  request: object;
  response: object;
  status: number;
}


/** React Query Response 通用型別
 * 適用於使用ReactQuery Fetch API 資料時
 * 將客製的 Type 賦予於 @data
 */
export interface RqResponseType {
  isLoading: boolean;
  error: { message: string } | null;
  data: unknown;
}