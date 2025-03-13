export const vastaiHeader = new Headers({
  Accept: "application/json",
  Authorization: `Bearer ${process.env.VASTAI_API_KEY}`,
});
