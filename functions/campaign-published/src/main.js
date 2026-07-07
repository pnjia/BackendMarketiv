export default async ({ res, log }) => {
  log("Function campaign-published triggered.");
  return res.json({ success: true, message: "Campaign published placeholder" });
};
