import { RequestOpts, RequestParameters } from "../../types/index.js";
import { Client } from "@opensearch-project/opensearch";

export const API_HOST = "https://www.selver.ee/api/catalog/";

export const apiRequestOpts = async (
  handler: RequestOpts,
  page: number = 0
): Promise<RequestParameters> => ({
  urlPath: await generateElasticQuery("product"),
  method: "GET",
  host: API_HOST,
  remoteCategoryId: handler.data.remoteId ?? "1",
  page,
});

export const generateElasticQuery = async (idx: string): Promise<string> => {
  const client = new Client({
    node: `${API_HOST}/${idx}`,
    // proxy: 'http://localhost:8080',
    // Connection: HttpConnection,
  });
  // client.
  try {
    const data = await client.search({
      index: "product",
      body: {
        query: {
          bool: {
            filter: {
              bool: {
                must: [
                  { terms: { visibility: [2, 3, 4] } },
                  { terms: { status: [0, 1] } },
                  { terms: { category_ids: [210] } },
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
                  "category.category_id": 210,
                },
              },
            },
          },
        ],
      },
      from: 0,
      size: 1000,
    });
    console.log(data);
  } catch (e) {
    console.log(e);
  }

  try {
    const cats = await client.search({
      index: "category",
      body: {
        query: {
          bool: {
            filter: {
              bool: {
                must: [
                  { terms: { level: [3] } },
                  { terms: { is_active: [true] } },
                ],
              },
            },
          },
        },
      },
    });
    console.log(cats)
  } catch (e) {
    console.log(e)
  }
  

  return "foo";
};
