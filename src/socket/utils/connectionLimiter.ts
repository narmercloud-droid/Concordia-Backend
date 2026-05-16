import { Socket } from "socket.io";

interface ConnectionLimitConfig {
  maxPerIP: number;       // max connections per IP
  perNamespace?: {
    [key: string]: number;
  };
}

interface ConnectionState {
  namespace: string;
  socketCount: number;
  sockets: Set<string>;
}

// ===== GLOBAL STATE =====
const ipConnections = new Map<string, Set<string>>();  // IP -> socket IDs
const namespaceConnections = new Map<string, ConnectionState>();  // namespace -> connection state

const DEFAULT_CONFIG: ConnectionLimitConfig = {
  maxPerIP: 5,
  perNamespace: {
    "/orders": 10,
    "/couriers": 5,
    "/admin": 20,
    "/kds": 10,
    "/customer": 5
  }
};

/**
 * Check if a new connection is allowed
 */
export const canConnect = (
  socket: Socket,
  config: ConnectionLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; reason?: string } => {
  const clientIP = socket.handshake.address;
  const namespace = socket.nsp.name;
  
  // ===== CHECK IP-LEVEL LIMIT =====
  if (!ipConnections.has(clientIP)) {
    ipConnections.set(clientIP, new Set());
  }
  
  const ipSockets = ipConnections.get(clientIP)!;
  
  if (ipSockets.size >= config.maxPerIP) {
    return {
      allowed: false,
      reason: `IP ${clientIP} has reached max connections (${config.maxPerIP})`
    };
  }

  // ===== CHECK NAMESPACE-LEVEL LIMIT =====
  const namespaceLimit = config.perNamespace?.[namespace] || config.maxPerIP;
  
  if (!namespaceConnections.has(namespace)) {
    namespaceConnections.set(namespace, {
      namespace,
      socketCount: 0,
      sockets: new Set()
    });
  }

  const nsState = namespaceConnections.get(namespace)!;
  
  if (nsState.socketCount >= namespaceLimit) {
    return {
      allowed: false,
      reason: `Namespace ${namespace} has reached max connections (${namespaceLimit})`
    };
  }

  // ===== CONNECTION ALLOWED =====
  ipSockets.add(socket.id);
  nsState.sockets.add(socket.id);
  nsState.socketCount++;

  return { allowed: true };
};

/**
 * Register a successful connection
 */
export const registerConnection = (socket: Socket): void => {
  const clientIP = socket.handshake.address;
  const namespace = socket.nsp.name;

  if (!ipConnections.has(clientIP)) {
    ipConnections.set(clientIP, new Set());
  }
  ipConnections.get(clientIP)!.add(socket.id);

  if (!namespaceConnections.has(namespace)) {
    namespaceConnections.set(namespace, {
      namespace,
      socketCount: 0,
      sockets: new Set()
    });
  }

  const nsState = namespaceConnections.get(namespace)!;
  nsState.sockets.add(socket.id);
  nsState.socketCount++;
};

/**
 * Clean up connection when socket disconnects
 */
export const unregisterConnection = (socket: Socket): void => {
  const clientIP = socket.handshake.address;
  const namespace = socket.nsp.name;

  // Remove from IP tracking
  if (ipConnections.has(clientIP)) {
    ipConnections.get(clientIP)!.delete(socket.id);
    
    // Clean up empty entries
    if (ipConnections.get(clientIP)!.size === 0) {
      ipConnections.delete(clientIP);
    }
  }

  // Remove from namespace tracking
  if (namespaceConnections.has(namespace)) {
    const nsState = namespaceConnections.get(namespace)!;
    nsState.sockets.delete(socket.id);
    nsState.socketCount = Math.max(0, nsState.socketCount - 1);
    
    // Clean up empty entries
    if (nsState.socketCount === 0) {
      namespaceConnections.delete(namespace);
    }
  }
};

/**
 * Get connection count for an IP
 */
export const getIPConnectionCount = (clientIP: string): number => {
  return ipConnections.get(clientIP)?.size || 0;
};

/**
 * Get connection count for a namespace
 */
export const getNamespaceConnectionCount = (namespace: string): number => {
  return namespaceConnections.get(namespace)?.socketCount || 0;
};

/**
 * Get all connection stats
 */
export const getConnectionStats = () => {
  const stats: any = {
    totalIPsConnected: ipConnections.size,
    namespaces: {}
  };

  for (const [namespace, state] of namespaceConnections) {
    stats.namespaces[namespace] = {
      totalConnections: state.socketCount,
      activeSocketCount: state.sockets.size
    };
  }

  return stats;
};

/**
 * Kick all connections from an IP (e.g., for abuse)
 */
export const disconnectIP = (socket: any, clientIP: string): void => {
  const sockets = ipConnections.get(clientIP);
  if (!sockets) return;

  for (const socketId of sockets) {
    const targetSocket = socket.nsp.sockets.get(socketId);
    if (targetSocket) {
      targetSocket.disconnect(true);
    }
  }

  ipConnections.delete(clientIP);
};

/**
 * Kick all connections from a namespace
 */
export const disconnectNamespace = (namespace: string, reason: string = "Server reset"): void => {
  if (!namespaceConnections.has(namespace)) return;

  const nsState = namespaceConnections.get(namespace)!;
  
  for (const socketId of nsState.sockets) {
    // Note: This requires access to the actual socket instance
    // Best called from within the namespace connection handler
  }

  namespaceConnections.delete(namespace);
};

/**
 * Middleware for Socket.IO namespace
 */
export const createConnectionLimitMiddleware = (
  config: ConnectionLimitConfig = DEFAULT_CONFIG
) => {
  return (socket: Socket, next: (err?: Error) => void) => {
    const { allowed, reason } = canConnect(socket, config);

    if (!allowed) {
      console.warn(`Connection rejected: ${reason}`);
      return next(new Error(reason || "Connection limit exceeded"));
    }

    // Register the connection
    registerConnection(socket);

    // Clean up on disconnect
    socket.on("disconnect", () => {
      unregisterConnection(socket);
    });

    next();
  };
};

/**
 * Get detailed connection info for debugging
 */
export const getDetailedConnectionStats = () => {
  const stats: any = {
    ips: {},
    namespaces: {}
  };

  for (const [ip, sockets] of ipConnections) {
    stats.ips[ip] = Array.from(sockets);
  }

  for (const [ns, state] of namespaceConnections) {
    stats.namespaces[ns] = {
      count: state.socketCount,
      sockets: Array.from(state.sockets)
    };
  }

  return stats;
};
