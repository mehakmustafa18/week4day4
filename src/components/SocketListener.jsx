import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socket from '../socket';
import { chatApi } from '../services/chatApi';

function SocketListener({ roomId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) return;

    socket.emit('join-room', roomId);

    const handleReceiveMessage = (message) => {
      // Direct cache write via updateQueryData
      dispatch(
        chatApi.util.updateQueryData('getMessages', roomId, (draft) => {
          if (Array.isArray(draft)) {
            draft.push(message);
          }
        })
      );
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [roomId, dispatch]);

  return null;
}

export default SocketListener;
