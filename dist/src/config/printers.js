export const kitchenPrinters = {
    A: [], // Kitchen A still uses no printers
    B: [
        {
            id: "B1",
            type: "network",
            host: "192.168.1.50",
            port: 9100,
            status: {
                online: false,
                lastCheck: null,
                lastSuccess: null,
                lastError: null
            }
        },
        {
            id: "B2",
            type: "network",
            host: "192.168.1.51",
            port: 9100,
            status: {
                online: false,
                lastCheck: null,
                lastSuccess: null,
                lastError: null
            }
        }
    ]
};
