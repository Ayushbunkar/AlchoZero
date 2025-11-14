import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 });
    res.json(events);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
