export function buildOrderSlip(order, qrImage) {
  return {
    type: 'print',
    content: [
      { type: 'text', value: 'ORDER #' + order.id, style: 'title' },
      { type: 'text', value: 'Customer: ' + (order.customer?.name || 'N/A') },
      { type: 'text', value: 'Phone: ' + (order.customer?.phone || 'N/A') },
      { type: 'text', value: '--- Items ---' },
      ...order.items.map(i => ({
        type: 'text',
        value: `${i.quantity} x ${i.name} - ${i.price} AED`
      })),
      { type: 'text', value: '--- Total ---' },
      { type: 'text', value: order.total + ' AED' },
      { type: 'image', value: qrImage }
    ]
  };
}
