type PaginatedResponseCreatorOption = {
  page?: number;
  pageSize?: number;
  totalCount?: number;
};

interface ResponseCreator {
  success: boolean;
  data?: any;
  error?: any;
}

export const paginatedResponseCreator = (
  data: any,
  options?: PaginatedResponseCreatorOption
) => {
  if (Array.isArray(data)) {
    return {
      page: options?.page,
      pageSize: options?.pageSize,
      totalCount: options?.totalCount,
      data,
    };
  }
  return {
    data,
  };
};

export const responseCreator = (response: ResponseCreator) => {
  return {
    success: response.success,
    data: response.data,
    error: response.error,
  };
};
