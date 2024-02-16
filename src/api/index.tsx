export const DUMMYJSON_URL = 'https://dummyjson.com';




/** API Result Type
 * @returns isLoading
 * @returns error
 * @returns data
 */
export interface ApiResultType {
  isLoading: boolean;
  error: any | { message: string }; // 型別待修正
  data: unknown; // 型別待修正
}