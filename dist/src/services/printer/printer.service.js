import escpos from "escpos";
import escposNetwork from "escpos-network";
escpos.Network = escposNetwork;
export async function printKitchenTicket(printer, order, items) {
    const printerCfg = printer;
    if (!printerCfg)
        return;
    const device = new escpos.Network(printerCfg.host, printerCfg.port);
    const printerInst = new escpos.Printer(device);
    device.open(() => {
        printerInst
            .align("CT")
            .style("B")
            .size(2, 2)
            .text(`ORDER #${order.id}`)
            .size(1, 1)
            .text("------------------------")
            .align("LT");
        items.forEach((i) => {
            printerInst.text(`${i.quantity}x ${i.item.name}`);
            if (i.notes)
                printerInst.text(`  Notes: ${i.notes}`);
        });
        printerInst
            .text("------------------------")
            .text(`Time: ${new Date().toLocaleTimeString()}`)
            .cut()
            .close();
    });
}
