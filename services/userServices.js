exports.getExpenses = async (req) => {
  return await req.user.getExpenses();
};
