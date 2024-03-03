export const calculatePageItem = (page: string, pageSize: string) => {
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  return {
    skip,
    take,
  };
};
