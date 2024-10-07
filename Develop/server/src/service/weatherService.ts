// export default new WeatherService();
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Class for storing weather data
class Weather {
  constructor(
    public date: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public description: string,
    public icon: string
  ) {}
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiKey = process.env.OPENWEATHER_API_KEY; // Your OpenWeather API key

  // Fetch location data (latitude and longitude) for a given city name
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const geocodeURL = this.buildGeocodeQuery(city);
    const response = await axios.get(geocodeURL);
    return this.destructureLocationData(response.data);
  }

  // Convert the API response to Coordinates (latitude and longitude)
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  // Build the query to retrieve geocode data from OpenWeather
  private buildGeocodeQuery(city: string): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${this.apiKey}`;
  }

  // Build the weather query URL using the coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // Fetch and parse weather data for the given coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherURL = this.buildWeatherQuery(coordinates);
    const response = await axios.get(weatherURL);
    return this.parseWeatherData(response.data);
  }

  // Parse the weather data and return an array of Weather objects
  private parseWeatherData(data: any): Weather[] {
    return data.list.map((entry: any) => new Weather(
      entry.dt_txt,
      entry.main.temp,
      entry.main.humidity,
      entry.wind.speed,
      entry.weather[0].description,
      entry.weather[0].icon
    ));
  }

  // Main method to get weather data for a given city name
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchLocationData(city);
    return this.fetchWeatherData(coordinates);
  }
}

export default new WeatherService();
