export default catchAsync => async (request, response, next) => {
  try {
    await catchAsync(request, response, next);
  }
  catch (e) {
    return next(e);
  }
}
