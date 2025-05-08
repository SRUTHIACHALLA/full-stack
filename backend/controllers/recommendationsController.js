import axios from 'axios';

export const getRecommendations = async (req, res) => {
  const { userId } = req.params;
  try {
    const { data } = await axios.get(`http://localhost:5001/recommend/${userId}`);
    res.json(data); // Forward recommendations to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Recommendation service failed' });
  }
};
