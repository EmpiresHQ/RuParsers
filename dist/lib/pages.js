export const pagesParser = ({ pageNumber, totalProducts, perPage, }) => {
    const currentOffset = pageNumber * perPage;
    const hasNextPage = (currentOffset + perPage) < totalProducts;
    return {
        hasNextPage,
        nextPage: hasNextPage ? pageNumber + 1 : undefined
    };
};
