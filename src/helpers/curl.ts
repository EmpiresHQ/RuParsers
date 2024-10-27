import * as dotenv from "dotenv";
dotenv.config()

type CurlFetchParams = {
    method: "GET" | "POST";
    urlPath: string;
    host?: string;
    proxy?: {
      url: string;
      auth?: string;
      os?: string
    };
    payload?: unknown;
    cookies?: {name: string; value:string}[];
    headers?: string[];
    jar?: string;
    timeout?: number;
    verbose?: boolean;
  }

export const curlFetch = async (params: CurlFetchParams): Promise<unknown> => {
  if (!process.env.CURL_URL) {
    throw new Error('not curl url')
  }
  const data = fetch(process.env.CURL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(params)
  })
  return data;
}