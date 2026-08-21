export const success = (res, data, meta, status = 200) => {
  const body = { success: true };
  if (meta) {
    body.data = data;
    body.meta = meta;
  } else {
    body.data = data;
  }
  return res.status(status).json(body);
};

export const created = (res, data) => success(res, data, undefined, 201);

export const noContent = (res) => res.status(204).json({ success: true });

export const failure = (res, code, message, status, details) =>
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });