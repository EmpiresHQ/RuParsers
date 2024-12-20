type CurlFetchParams = {
  method: "GET" | "POST";
  url?: string;
  urlPath?: string;
  host?: string;
  proxy?: {
    url: string;
    auth?: string;
    os?: string;
  };
  payload?: unknown;
  version?: 'V2Tls'
  raw?: string;
  cookies?: { name: string; value: string }[];
  headers?: string[];
  jar?: string;
  timeout?: number;
  verbose?: boolean;
};

export const curlFetch = async <T>(
  params: CurlFetchParams,
  load: "json" | "text" | "buffer" = "json"
): Promise<T> => {
  if (!process.env.CURL_URL) {
    throw new Error("not curl url");
  }
  if (params.urlPath && params.host) {
    params.url = `${params.host}${params.urlPath}`
    delete params.urlPath;
    delete params.host;
  }
  if (!params.url) {
    throw new Error('no URL')
  }
  // console.log('sending: ', JSON.stringify(params, null ,2))
  // console.log('sending: ', params)
  const data = await fetch(process.env.CURL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(params),
  });
  // console.log('resp: ', await data.text())
  switch (load) {
    case 'text':
      return data.text() as T
    case 'json':
      return data.json() as T
    default:
      return data.arrayBuffer() as T
  }
  
};
