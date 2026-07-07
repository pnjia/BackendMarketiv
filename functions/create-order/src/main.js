export default async ({ res, log }) => {
  log("Function create-order triggered.");
  return res.json({ success: true, message: "Order creation placeholder" });
};
