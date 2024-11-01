type CurlFetchParams = {
  method: "GET" | "POST";
  url: string;
  proxy?: {
    url: string;
    auth?: string;
    os?: string;
  };
  payload?: unknown;
  cookies?: { name: string; value: string }[];
  headers?: string[];
  jar?: string;
  timeout?: number;
  verbose?: boolean;
};

export const curlFetch = async (
  params: CurlFetchParams,
  load: "json" | "text" | "buffer" = "json"
): Promise<unknown> => {
  if (!process.env.CURL_URL) {
    throw new Error("not curl url");
  }
  const data = await fetch(process.env.CURL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(params),
  });
  switch (load) {
    case 'text':
      return data.text()
    case 'json':
      return data.json()
    default:
      return data.arrayBuffer()
  }
  
};
