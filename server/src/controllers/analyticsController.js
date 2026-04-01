export const getOverview = async (req, res) => {
  res.json({ summary: {} })
}

export const getClassAnalytics = async (req, res) => {
  res.json({ classId: req.params.id, summary: {} })
}
