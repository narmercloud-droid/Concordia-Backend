export function registerAdminEvents(io) {
    io.on("connection", (socket) => {
        // Check if this is an admin connection (you might want to add authentication here)
        const isAdmin = socket.handshake.auth?.admin_token || socket.handshake.query?.admin === "true";
        if (isAdmin) {
            socket.join("admin_dashboard");
            console.log("Admin connected to dashboard");
            socket.on("disconnect", () => {
                console.log("Admin disconnected from dashboard");
            });
        }
    });
}
