import { io, type Socket } from 'socket.io-client';

type SocketEventMap = Record<string, (...args: never[]) => void>;

let socketInstance: Socket | null = null;

export function getSocket<TEvents extends object = object>(): Socket<TEvents & SocketEventMap> {
  if (!socketInstance) {
    const url = import.meta.env.VITE_API_URL;
    socketInstance = io(url, {
      autoConnect: true,
    });
  }

  return socketInstance as Socket<TEvents & SocketEventMap>;
}
