export const pagesParser = ({
  pageNumber,
  totalProducts,
  perPage,
}: {
  pageNumber: number;
  totalProducts: number;
  perPage: number;
}): {hasNextPage: boolean, nextPage: number | undefined} => {
  const currentOffset = pageNumber * perPage;
  const hasNextPage = (currentOffset + perPage) < totalProducts
  return {
    hasNextPage,
    nextPage: hasNextPage ? pageNumber + 1 : undefined
  }
};
