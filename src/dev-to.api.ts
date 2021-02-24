import { Singleton } from "typescript-ioc";
import axios from 'axios';

@Singleton
export class DevToAPI {
  private endpoint = 'https://dev.to/api';

  async articles() {
    const response = await axios.get(`${this.endpoint}/articles?per_page=3`);
    return response.data;
  }
}