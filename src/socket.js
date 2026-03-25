import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://h2f6t8-5000.csb.app';

const socket = io(BACKEND_URL, {
  autoConnect: false,
});

export default socket;
