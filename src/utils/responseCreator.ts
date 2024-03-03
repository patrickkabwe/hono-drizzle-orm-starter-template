type PaginatedResponseCreatorOption = {
  page?: number;
  pageSize?: number;
  totalCount?: number;
};

type ErrorResponse = {
  errors?: any;
};

interface ResponseCreator {
  success: boolean;
  data?: ErrorResponse | any;
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
  };
};
