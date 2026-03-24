import { useGetUsersQuery } from '../services/chatApi';

function Sidebar({ currentUser, currentRoom, onSelectRoom, onLogout }) {
  const { data: users = [], isLoading } = useGetUsersQuery();

  const rooms = ['general', 'tech', 'random'];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>ChatApp</h3>
        <p>Welcome, <b>{currentUser.username}</b></p>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="sidebar-section">
        <h4>Rooms</h4>
        <ul>
          {rooms.map(room => (
            <li 
              key={room} 
              className={currentRoom === room ? 'active' : ''}
              onClick={() => onSelectRoom(room)}
            >
              #{room}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h4>Online Users</h4>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {users.map(u => (
              <li key={u._id} className="user-item">
                <span className="status-dot"></span>
                {u.username}
                {u.username === currentUser.username && ' (You)'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
