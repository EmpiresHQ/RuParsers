import { CategoryParser } from "../../types/index.js";

export const apiParser: CategoryParser = async ({ json }) => {
  if (!Buffer.isBuffer(json)) {
    throw new Error("is a buffer");
  }
  return {
    items: [],
    hasNextPage: false
  }
};
