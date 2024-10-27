import { describe, expect, test } from "vitest";
import { API_HOST, API_SETTINGS, apiRequestOpts } from "./settings.js";
import { renderer } from "../../helpers/renderer.js";
import { curlFetch } from "../../helpers/curl.js";

describe("Vseinstrumenti.ru loader", () => {
  test("load products", async () => {
    if (!API_SETTINGS.antibotOpts) {
      throw new Error('not antobot params')
    }
    
    const response = await renderer(API_SETTINGS.antibotOpts)
    expect(response).toBeDefined()
    const data = apiRequestOpts({
      data: {
        text: "akkumulyatornye-dreli-shurupoverty-15",
        remoteId: "2392",
        meta: {
          antibotData: response
        }
      }
    }, 1);
    console.log(data)
    expect(data).toBeDefined()
    const reply = await curlFetch({
      ...data,
      cookies: response.cookies,
      url: `${API_HOST}${data.urlPath}`,
      proxy: {
        url: process.env.TEST_PROXY_URL ?? "",
        auth: process.env.TEST_PROXY_AUTH
      }
    })
    expect(reply).toBeDefined()
    console.log(reply)
    
  });
}, 50000);
