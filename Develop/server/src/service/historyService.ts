
// export default new HistoryService();
//
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string = uuidv4()) {}
}

class HistoryService {
  private filePath = 'searchHistory.json';

  // Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return data;
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then(data => {
      let parsedCities: City[]; 
      try { 
        parsedCities = [].concat(JSON.parse(data)); 
        
      } catch (error) { parsedCities = []; }
      return parsedCities;
        
      
    });
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.getCities();
    const newCity = new City(cityName);
    cities.push(newCity);
    await this.write(cities);
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
