// // import { Router, type Request, type Response } from 'express';
// // const router = Router();

// // // import HistoryService from '../../service/historyService.js';
// // // import WeatherService from '../../service/weatherService.js';

// // // TODO: POST Request with city name to retrieve weather data
// // router.post('/', (req: Request, res: Response) => {
// //   // TODO: GET weather data from city name
// //   // TODO: save city to search history
// // });

// // // TODO: GET search history
// // router.get('/history', async (req: Request, res: Response) => {});

// // // * BONUS TODO: DELETE city from search history
// // router.delete('/history/:id', async (req: Request, res: Response) => {});

// // export default router;
// //

// import { Router, type Request, type Response } from 'express';
// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// const router = Router();

// // POST Request with city name to retrieve weather data
// router.post('/', async (req: Request, res: Response) => {
//   const { city } = req.body;
//   if (!city) {
//     return res.status(400).json({ error: 'City name is required' });
//   }

//   try {
//     // Get weather data from city name
//     const weatherData = await WeatherService.getWeatherForCity(city);

//     // Save city to search history
//     await HistoryService.addCity(city);

//     return res.json(weatherData);
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to fetch weather data' });
//   }
// });

// // GET search history
// router.get('/history', async (_req: Request, res: Response) => {
//   try {
//     const cities = await HistoryService.getCities();
//     return res.json(cities);
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to fetch search history' });
//   }
// });

// // BONUS: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     await HistoryService.removeCity(id);
//     return res.json({ message: 'City removed from search history' });
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to remove city' });
//   }
// });

// export default router;
import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request to retrieve weather data based on city name
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body; // Extract city from the request body
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
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET Request to retrieve search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities); // Return the list of cities in search history
  } catch (error) {
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
    return res.status(500).json({ error: 'Failed to remove city' });
  }
});

export default router;
