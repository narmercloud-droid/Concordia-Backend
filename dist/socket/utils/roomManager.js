// ===== GLOBAL STATE =====
const rooms = new Map();
const socketToRooms = new Map(); // socket ID -> room names
const branchRooms = new Map(); // branch ID -> room names
const ROOM_CLEANUP_TIMEOUT = 60000; // 1 minute of inactivity
const ROOM_CLEANUP_CHECK_INTERVAL = 30000; // Check every 30 seconds
/**
 * Get or create a room (lazy creation)
 */
export const getOrCreateRoom = (namespace, roomName, branchId) => {
    if (!rooms.has(roomName)) {
        rooms.set(roomName, {
            name: roomName,
            type: extractRoomType(roomName),
            branchId,
            createdAt: Date.now(),
            socketCount: 0,
            sockets: new Set(),
            lastActivity: Date.now()
        });
    }
    return rooms.get(roomName);
};
/**
 * Join a socket to a room with lazy creation
 */
export const joinRoom = (socket, roomName, branchId) => {
    const room = getOrCreateRoom(socket.nsp, roomName, branchId);
    socket.join(roomName);
    room.sockets.add(socket.id);
    room.socketCount++;
    room.lastActivity = Date.now();
    // Track socket -> rooms mapping
    if (!socketToRooms.has(socket.id)) {
        socketToRooms.set(socket.id, new Set());
    }
    socketToRooms.get(socket.id).add(roomName);
    // Track branch -> rooms mapping
    if (branchId) {
        if (!branchRooms.has(branchId)) {
            branchRooms.set(branchId, new Set());
        }
        branchRooms.get(branchId).add(roomName);
    }
    return room;
};
/**
 * Leave a room and clean up if empty
 */
export const leaveRoom = (socket, roomName) => {
    const room = rooms.get(roomName);
    if (!room)
        return false;
    socket.leave(roomName);
    room.sockets.delete(socket.id);
    room.socketCount = Math.max(0, room.socketCount - 1);
    room.lastActivity = Date.now();
    // Clean up socket -> rooms mapping
    if (socketToRooms.has(socket.id)) {
        socketToRooms.get(socket.id).delete(roomName);
    }
    // Delete empty room
    if (room.socketCount === 0) {
        rooms.delete(roomName);
        // Clean up branch -> rooms mapping
        if (room.branchId && branchRooms.has(room.branchId)) {
            branchRooms.get(room.branchId).delete(roomName);
            if (branchRooms.get(room.branchId).size === 0) {
                branchRooms.delete(room.branchId);
            }
        }
        return true;
    }
    return false;
};
/**
 * Clean up all rooms when socket disconnects
 */
export const cleanupSocketRooms = (socket) => {
    const socketRooms = socketToRooms.get(socket.id);
    if (!socketRooms)
        return;
    for (const roomName of socketRooms) {
        leaveRoom(socket, roomName);
    }
    socketToRooms.delete(socket.id);
};
/**
 * Get rooms for a socket
 */
export const getSocketRooms = (socket) => {
    const socketRooms = socketToRooms.get(socket.id) || new Set();
    return Array.from(socketRooms)
        .map(roomName => rooms.get(roomName))
        .filter((room) => room !== undefined);
};
/**
 * Get rooms for a branch
 */
export const getBranchRooms = (branchId) => {
    const branchRoomNames = branchRooms.get(branchId) || new Set();
    return Array.from(branchRoomNames)
        .map(roomName => rooms.get(roomName))
        .filter((room) => room !== undefined);
};
/**
 * Get all active rooms
 */
export const getAllRooms = () => {
    return Array.from(rooms.values());
};
/**
 * Get room stats
 */
export const getRoomStats = (roomName) => {
    return rooms.get(roomName) || null;
};
/**
 * Get branch-aware metrics
 */
export const getBranchMetrics = (branchId) => {
    const branchRoomList = getBranchRooms(branchId);
    return {
        branchId,
        totalRooms: branchRoomList.length,
        totalConnections: branchRoomList.reduce((sum, room) => sum + room.socketCount, 0),
        rooms: branchRoomList.map(room => ({
            name: room.name,
            type: room.type,
            sockets: room.socketCount,
            lastActivity: room.lastActivity
        }))
    };
};
/**
 * Get global room metrics
 */
export const getGlobalMetrics = () => {
    const allRooms = getAllRooms();
    return {
        totalRooms: allRooms.length,
        totalConnections: allRooms.reduce((sum, room) => sum + room.socketCount, 0),
        totalBranches: branchRooms.size,
        roomsByType: groupBy(allRooms, room => room.type)
    };
};
export const updateSocketRoomCount = (roomName) => {
    updateRoomActivity(roomName);
};
/**
 * Start automatic cleanup of inactive rooms
 */
export const startRoomCleanup = (namespace) => {
    return setInterval(() => {
        const now = Date.now();
        const toDelete = [];
        for (const [roomName, room] of rooms) {
            // Delete empty rooms
            if (room.socketCount === 0) {
                toDelete.push(roomName);
            }
            // Delete inactive rooms after timeout
            else if (now - room.lastActivity > ROOM_CLEANUP_TIMEOUT) {
                console.log(`Auto-cleanup: room "${roomName}" inactive for ${(now - room.lastActivity) / 1000}s`);
                toDelete.push(roomName);
            }
        }
        for (const roomName of toDelete) {
            rooms.delete(roomName);
        }
    }, ROOM_CLEANUP_CHECK_INTERVAL);
};
/**
 * Manual cleanup of a specific room
 */
export const forceCleanupRoom = (roomName, namespace) => {
    const room = rooms.get(roomName);
    if (!room)
        return;
    // Disconnect all sockets in room
    namespace.to(roomName).disconnectSockets();
    rooms.delete(roomName);
    // Clean up mappings
    for (const socketId of room.sockets) {
        if (socketToRooms.has(socketId)) {
            socketToRooms.get(socketId).delete(roomName);
        }
    }
    if (room.branchId && branchRooms.has(room.branchId)) {
        branchRooms.get(room.branchId).delete(roomName);
    }
};
/**
 * Update room activity timestamp
 */
export const updateRoomActivity = (roomName) => {
    const room = rooms.get(roomName);
    if (room) {
        room.lastActivity = Date.now();
    }
};
/**
 * Extract room type from room name
 */
function extractRoomType(roomName) {
    if (roomName.startsWith("customer_"))
        return "customer";
    if (roomName.startsWith("courier_"))
        return "courier";
    if (roomName.startsWith("kds_"))
        return "kds";
    if (roomName.startsWith("admin_"))
        return "admin";
    if (roomName.startsWith("order_"))
        return "order";
    if (roomName.startsWith("branch_"))
        return "branch";
    return "unknown";
}
/**
 * Group array by property
 */
function groupBy(arr, keyFn) {
    return arr.reduce((acc, item) => {
        const key = keyFn(item);
        if (!acc[key])
            acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}
