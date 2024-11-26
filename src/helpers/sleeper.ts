export const sleeper = async (delay: number) =>
  new Promise((res) => setTimeout(res, delay));
