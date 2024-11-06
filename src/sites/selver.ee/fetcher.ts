import { ProxyType, RequestParameters } from "../../types/settings.js";
import { Client } from "@opensearch-project/opensearch";
import { API_HOST } from "./settings.js";
import { proxyUrl } from "../../helpers/proxy.js";
import { ProductContainer } from "./types.js";

export const fetcher = async (
  requestParams: RequestParameters
): Promise<ProductContainer[] | { error: unknown }> => {
  let retries = 5;
  // console.log("req params: ", JSON.stringify(requestParams, null, 2));
  const _internal = async () => {
    const { data, error } = await fetcherCore(requestParams);
    if (data) {
      return data;
    }
    await new Promise((r) => setTimeout(r, 1000));
    console.log("retrying ...", retries);
    retries -= 1;
    if (retries > 0) {
      return await _internal();
    } else {
      return {
        error,
      };
    }
  };
  const data = await _internal();

  return data;
};

const fetcherCore = async (requestParams: RequestParameters) => {
  const { client, node } = openSearchClient({
    proxyParam: requestParams.proxy,
  });
  const offset = 1000;
  try {
    const data = await client.search<{ hits: { hits: ProductContainer[] } }>({
      index: "product",
      body: {
        query: {
          bool: {
            filter: {
              bool: {
                must: [
                  { terms: { visibility: [2, 3, 4] } },
                  { terms: { status: [0, 1] } },
                  {
                    terms: { category_ids: [+requestParams.remoteCategoryId] },
                  },
                ],
              },
            },
          },
        },
        sort: [
          {
            "category.position": {
              order: "asc",
              nested_path: "category",
              nested_filter: {
                term: {
                  "category.category_id": +requestParams.remoteCategoryId,
                },
              },
            },
          },
        ],
      },
      from: offset * ((requestParams.page ?? 1) - 1),
      size: offset,
    });
    return {
      data: data.body.hits.hits,
      node,
    };
  } catch (e) {
    return {
      error: e,
      node,
    };
  }
};

export const openSearchClient = ({
  idx = "vue_storefront_catalog_et",
  proxyParam,
}: {
  idx?: string;
  proxyParam?: ProxyType;
}) => {
  const proxy = proxyParam && proxyUrl(proxyParam);
  // console.log("proxy: ", proxy);
  const node = `${API_HOST}/${idx}`;
  const client = new Client({
    ssl: {
      rejectUnauthorized: false,
    },
    compression: "gzip",
    node,
    ...(proxy ? { proxy } : {}),
  });
  return { client, node };
};
