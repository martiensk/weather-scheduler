/**
 * @file This service is responsible for fetching weather data from the weather API.
 */
import type { IWeatherCurrent, IWeatherLocation } from 'shared-lib';
import axios from 'axios';
import config from '../config.json';

const baseEndpoint = 'https://api.weatherapi.com/v1/';

/**
 * Retrieves weather locations based on a query string.
 * @param {string} query - The query string to search for weather locations.
 * @returns {IWeatherLocation[]} An array of weather locations that match the query string.
 * @throws An error if the API call fails.
 */
export const getLocations = async(query: string) => {
  try {
    // This could technically be moved to a repository (and should be) but at this point it's just duplication.
    const response = await axios.get(`${baseEndpoint}search.json?key=${config.weather.api_key}&q=${query}`);
    return response.data as IWeatherLocation[];
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

/**
 * Retrieves current weather data for a given location.
 * @param {string} query - The location to retrieve weather data for.
 * @returns {IWeatherCurrent} An object containing the current weather data for the specified location.
 * @throws An error if the API call fails.
 */
export const getWeather = async(query: string) => {
  try {
    // No localisation supported (out of scope) so we'll just use English.
    const response = await axios.get(`${baseEndpoint}current.json?key=${config.weather.api_key}&q=${query}&lang=en`);
    return response.data as IWeatherCurrent;
  } catch (ex) {
    console.log(ex);
    throw ex;
  }
};

