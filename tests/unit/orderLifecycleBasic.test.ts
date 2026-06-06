import { OrderLifecycleService } from '../../src/services/order/orderLifecycle.service';

describe('OrderLifecycleService basic utilities', () => {
  test('normalizeStatus maps aliases', () => {
    expect(OrderLifecycleService.normalizeStatus('ready')).toBe('ready_for_pickup');
  });

  test('isTransitionAllowed enforces rules', () => {
    expect(OrderLifecycleService.isTransitionAllowed('pending', 'accepted')).toBe(true);
    expect(OrderLifecycleService.isTransitionAllowed('pending', 'delivered')).toBe(false);
  });
});
