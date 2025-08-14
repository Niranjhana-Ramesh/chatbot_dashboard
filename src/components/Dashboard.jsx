import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('demoUserName') || '';
    setUsername(storedName);
    const storedAgents = JSON.parse(localStorage.getItem('agents')) || [];
    setAgents(storedAgents);
  }, []);

  const handleDelete = (id) => {
    const updatedAgents = agents.filter((agent) => agent.id !== id);
    setAgents(updatedAgents);
    localStorage.setItem('agents', JSON.stringify(updatedAgents));
  };

  const handleLogout = () => {
    localStorage.removeItem('demoUserName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome{username ? `, ${username}` : ''}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>
        <Link to="/agent/new">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mb-6">
            Create New Agent
          </button>
        </Link>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-gray-900">S.No</th>
                <th className="px-4 py-2 text-left text-gray-900">Name</th>
                <th className="px-4 py-2 text-left text-gray-900">Type</th>
                <th className="px-4 py-2 text-left text-gray-900">Date Created</th>
                <th className="px-4 py-2 text-left text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <tr key={agent.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{agent.name}</td>
                  <td className="px-4 py-2">{agent.type}</td>
                  <td className="px-4 py-2">{new Date(agent.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={`/agent/${agent.id}`}>
                      <button className="bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    No agents found. Click "Create New Agent" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
