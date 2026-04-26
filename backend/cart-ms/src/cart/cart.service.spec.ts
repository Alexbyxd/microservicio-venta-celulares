import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let mockRedis: any;

  const mockUserId = 'user-123';
  const mockItem = {
    productId: 'prod-1',
    name: 'iPhone 15',
    price: 1000,
    quantity: 1,
  };

  beforeEach(async () => {
    mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return an empty cart if not found in Redis', async () => {
      mockRedis.get.mockResolvedValue(null);
      const cart = await service.getCart(mockUserId);
      expect(cart.items).toHaveLength(0);
      expect(cart.userId).toBe(mockUserId);
    });

    it('should return parsed cart if found in Redis', async () => {
      const storedCart = { userId: mockUserId, items: [mockItem], totalAmount: 1000 };
      mockRedis.get.mockResolvedValue(JSON.stringify(storedCart));
      const cart = await service.getCart(mockUserId);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId).toBe('prod-1');
    });
  });

  describe('addItem', () => {
    it('should add a new item and calculate total', async () => {
      mockRedis.get.mockResolvedValue(null); // Empty cart
      const cart = await service.addItem(mockUserId, mockItem);
      
      expect(cart.items).toHaveLength(1);
      expect(cart.totalAmount).toBe(1000);
      expect(mockRedis.set).toHaveBeenCalled();
    });

    it('should increment quantity if item already exists', async () => {
      const storedCart = { userId: mockUserId, items: [{ ...mockItem, quantity: 2 }], totalAmount: 2000 };
      mockRedis.get.mockResolvedValue(JSON.stringify(storedCart));
      
      const cart = await service.addItem(mockUserId, { ...mockItem, quantity: 3 });
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5);
      expect(cart.totalAmount).toBe(5000);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const storedCart = { userId: mockUserId, items: [mockItem], totalAmount: 1000 };
      mockRedis.get.mockResolvedValue(JSON.stringify(storedCart));
      
      const cart = await service.removeItem(mockUserId, 'prod-1');
      
      expect(cart.items).toHaveLength(0);
      expect(cart.totalAmount).toBe(0);
    });
  });
});
