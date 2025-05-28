import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CurrencyService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  async getExchangeRate(from: string, to: string): Promise<number> {
    const cacheKey = `rate-${from}-${to}`;
    const cached = await this.cacheManager.get<number>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    // Fetch from API
    const rate = await this.fetchRateFromAPI(from, to);
    
    // Cache it for 1 hour
    await this.cacheManager.set(cacheKey, rate, 3600);
    return rate;
  }
  
  private async fetchRateFromAPI(from: string, to: string): Promise<number> {
    // fetch from real API here
    return 1.08; // mocked
  }
}
