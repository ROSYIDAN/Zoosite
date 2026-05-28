// Response utility functions

export function successResponse<T>(data: T, status: number = 200): Response {
  return Response.json({ data }, { status });
}

export function listResponse<T>(data: T[], meta: { total: number; page: number; limit: number }): Response {
  return Response.json({
    data,
    meta,
  });
}

export function messageResponse(message: string, status: number = 200): Response {
  return Response.json({ message }, { status });
}

export function errorResponse(message: string, status: number = 400): Response {
  return Response.json({ message }, { status });
}