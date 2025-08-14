import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const AGENT_TYPES = [
  { value: 'college-query-bot', label: 'College Query Bot' },
  { value: 'advanced-college-bot', label: 'Advanced College Bot' },
  { value: 'admission-bot', label: 'Admission Bot' },
  { value: 'summarisation-bot', label: 'Summarisation Bot' },
];

const AgentForm = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [type, setType] = useState(AGENT_TYPES[0].value);
  const [color, setColor] = useState('#000000');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState([]);
  const [embedCode, setEmbedCode] = useState('');
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      const agents = JSON.parse(localStorage.getItem('agents')) || [];
      const agent = agents.find((a) => a.id === id);
      if (agent) {
        setName(agent.name);
        setType(agent.type);
        setColor(agent.color);
        setDescription(agent.description || '');
        setDocuments(agent.documents || []);
        generateEmbedCode(id);
      }
    }
  }, [id, isEdit]);

  const generateEmbedCode = (agentId) => {
    const code = `<iframe src="https://example-chatbot.com/agent/${agentId}" width="300" height="400" style="border: none; position: fixed; bottom: 0; right: 0;"></iframe>`;
    setEmbedCode(code);
    return code;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const agents = JSON.parse(localStorage.getItem('agents')) || [];
    const newAgent = {
      id: isEdit ? id : uuidv4(),
      name,
      type,
      color,
      description,
      documents: type === 'advanced-college-bot' ? documents : [],
      createdAt: isEdit ? agents.find((a) => a.id === id).createdAt : Date.now(),
    };

    let updatedAgents;
    if (isEdit) {
      updatedAgents = agents.map((a) => (a.id === id ? newAgent : a));
      generateEmbedCode(id);
      setShowEmbedCode(true);
    } else {
      updatedAgents = [...agents, newAgent];
      const newEmbedCode = generateEmbedCode(newAgent.id);
      setEmbedCode(newEmbedCode);
      setShowEmbedCode(true);
    }

    localStorage.setItem('agents', JSON.stringify(updatedAgents));
  };

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files.map((file) => file.name));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {isEdit ? 'Edit Agent' : 'Create New Agent'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {AGENT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">UI Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
              required
            />
          </div>
          {type === 'advanced-college-bot' && (
            <div>
              <label className="block text-gray-700 mb-2">Upload Documents</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md"
              />
              {documents.length > 0 && (
                <ul className="mt-2 text-gray-700">
                  {documents.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            {isEdit ? 'Update' : 'Create'}
          </button>
        </form>
        {showEmbedCode && embedCode && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-gray-900">Embed Code</h3>
            <div className="flex items-center space-x-4">
              <textarea
                value={embedCode}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
                rows="4"
              />
              <button
                onClick={handleCopyEmbedCode}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentForm;
