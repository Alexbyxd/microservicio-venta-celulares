import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CatalogService } from '../catalog/catalog.service';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('CartController (Gateway)', () => {
  let controller: CartController;
  let catalogService: any;
  let cartClient: any;

  beforeEach(async () => {
    catalogService = {
      findProductById: jest.fn(),
    };
    cartClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CatalogService, useValue: catalogService },
        { provide: 'CART_SERVICE', useValue: cartClient },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addItem', () => {
    const mockUserId = 'user-1';
    const mockProductId = 'prod-1';
    const mockProduct = { _id: 'prod-1', name: 'iPhone 15', price: 1000, images: ['img1.jpg'] };

    it('should throw NotFoundException if product does not exist in catalog', async () => {
      catalogService.findProductById.mockResolvedValue(null);

      await expect(controller.addItem(mockUserId, { productId: mockProductId, quantity: 1 }))
        .rejects.toThrow(NotFoundException);
      
      expect(cartClient.send).not.toHaveBeenCalled();
    });

    it('should delegate to Cart MS if product exists', async () => {
      catalogService.findProductById.mockResolvedValue(mockProduct);
      cartClient.send.mockReturnValue(of({ success: true }));

      await controller.addItem(mockUserId, { productId: mockProductId, quantity: 2 });

      expect(cartClient.send).toHaveBeenCalledWith('cart.add', expect.objectContaining({
        userId: mockUserId,
        item: expect.objectContaining({
          productId: mockProductId,
          price: 1000,
          quantity: 2,
        })
      }));
    });
  });
});
