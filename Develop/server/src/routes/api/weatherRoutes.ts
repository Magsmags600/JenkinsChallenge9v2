import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request to retrieve weather data based on city name
router.post('/', async (req: Request, res: Response) => {
  const city = req.body.cityName; // Extract city from the request body
  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Fetch weather data from the WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save city to search history after successful data retrieval
    await HistoryService.addCity(city);

    // Send the fetched weather data as a response
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET Request to retrieve search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities); // Return the list of cities in search history
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// DELETE Request to remove a city from search history by id
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.json({ message: 'City removed from search history' });
  } catch (error) {
    console.error('Error removing city from history:', error);
    return res.status(500).json({ error: 'Failed to remove city' });
  }
});

export default router;
