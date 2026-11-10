import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppDataSource } from '../data-source.js';
import { WeatherSnapshot } from '../entities/WeatherSnapshot.js';
import { WeatherRepository } from './weather.repository.js';

vi.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: vi.fn(),
  },
}));

describe('WeatherRepository', () => {
  let repository: WeatherRepository;
  let mockRepo: {
    createQueryBuilder: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let mockQueryBuilder: {
    where: ReturnType<typeof vi.fn>;
    orderBy: ReturnType<typeof vi.fn>;
    getOne: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockQueryBuilder = {
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getOne: vi.fn(),
    };

    mockRepo = {
      createQueryBuilder: vi.fn().mockReturnValue(mockQueryBuilder),
      create: vi.fn(),
      save: vi.fn(),
    };

    (AppDataSource.getRepository as ReturnType<typeof vi.fn>).mockReturnValue(mockRepo);

    repository = new WeatherRepository();
  });

  it('should find latest forecast using query builder', async () => {
    const mockSnapshot = { id: 1, locationKey: 'minsk|by' } as WeatherSnapshot;
    mockQueryBuilder.getOne.mockResolvedValue(mockSnapshot);

    const result = await repository.findLatestForecastByLocation('minsk|by');

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(WeatherSnapshot);
    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('s');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('s.locationKey = :locationKey', {
      locationKey: 'minsk|by',
    });
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('s.fetchedAt', 'DESC');
    expect(result).toEqual(mockSnapshot);
  });

  it('should save a snapshot', async () => {
    const mockData: Partial<WeatherSnapshot> = { locationKey: 'minsk|by', payload: '{}' };
    const mockCreatedSnapshot = { id: 1, ...mockData } as WeatherSnapshot;
    const mockSavedSnapshot = { ...mockCreatedSnapshot };

    mockRepo.create.mockReturnValue(mockCreatedSnapshot);
    mockRepo.save.mockResolvedValue(mockSavedSnapshot);

    const result = await repository.saveSnapshot(mockData);

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(WeatherSnapshot);
    expect(mockRepo.create).toHaveBeenCalledWith(mockData);
    expect(mockRepo.save).toHaveBeenCalledWith(mockCreatedSnapshot);
    expect(result).toEqual(mockSavedSnapshot);
  });
});
