import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Cpu, Sparkles, Loader2, 
  Trash2, Clipboard, Mic, Paperclip 
} from 'lucide-react';
import * as aiService from '../services/aiService';
import useAuth from '../hooks/useAuth';

const Assistant = () => {
  const { user } = useAuth();
  const targetRole = user?.targetRole || "MERN Developer";

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **DevLens AI Assistant** calibrated for the target role: **${targetRole}**. 

I can analyze your GitHub activity, check your LeetCode DSA profile progress, run resume ATS keyword calculations, or generate a custom training curriculum. 

Click one of the **Quick Prompts** in the sidebar to begin, or type a question below!`,
      timestamp: new Date()
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size limit: 20MB
    const limit = 20 * 1024 * 1024;
    if (file.size > limit) {
      alert("File size exceeds 20MB limit. Please upload a smaller file.");
      e.target.value = null;
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await aiService.getChatHistory();
        if (history && history.length > 0) {
          setMessages(history);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    try {
      await aiService.clearChatHistory();
      setMessages([
        {
          sender: 'ai',
          text: `Hello! I am your **DevLens AI Assistant** calibrated for the target role: **${targetRole}**. 

I can analyze your GitHub activity, check your LeetCode DSA profile progress, run resume ATS keyword calculations, or generate a custom training curriculum. 

Click one of the **Quick Prompts** in the sidebar to begin, or type a question below!`,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
    }
  };

  const addMessage = (sender, text, file = null) => {
    setMessages((prev) => [...prev, { sender, text, timestamp: new Date(), file }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() && !selectedFile) return;

    const userQuery = inputMsg;
    const fileToUpload = selectedFile;

    // Clear inputs immediately
    setInputMsg('');
    handleRemoveFile();

    // Add user message with file details to UI thread
    setMessages((prev) => [...prev, {
      sender: 'user',
      text: userQuery,
      timestamp: new Date(),
      file: fileToUpload ? {
        originalname: fileToUpload.name,
        size: fileToUpload.size,
        mimetype: fileToUpload.type
      } : null
    }]);

    setLoading(true);

    try {
      let data;
      if (fileToUpload) {
        const formData = new FormData();
        formData.append('message', userQuery);
        formData.append('file', fileToUpload);
        data = await aiService.chatWithAssistantMultipart(formData);
      } else {
        data = await aiService.chatWithAssistant(userQuery);
      }

      setMessages((prev) => [...prev, {
        sender: 'ai',
        text: data.reply,
        timestamp: new Date(),
        file: data.file
      }]);
    } catch (err) {
      console.error(err);
      addMessage('ai', 'Error communicating with DevLens AI brain. Check backend servers.');
    } finally {
      setLoading(false);
    }
  };

  const executeQuickPrompt = async (type, label) => {
    addMessage('user', label);
    setLoading(true);

    try {
      let response;
      if (type === 'review') {
        const data = await aiService.getAIReview();
        response = data.review;
      } else if (type === 'gap') {
        const data = await aiService.getAIGapAnalysis();
        response = data.gapAnalysis;
      } else if (type === 'roadmap') {
        const data = await aiService.getAIRoadmap();
        response = data.roadmap;
      } else {
        const data = await aiService.chatWithAssistant("Suggest project improvements");
        response = data.reply;
      }
      addMessage('ai', response);
    } catch (err) {
      console.error(err);
      addMessage('ai', `Failed to execute prompt: ${label}. Is Node server on Port 8080 active?`);
    } finally {
      setLoading(false);
    }
  };

  // Convert custom markdown formatting to basic HTML components
  const renderMarkdown = (text) => {
    if (!text) return '';

    // Split text into lines to process tables or headers easily
    const lines = text.split('\n');
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];

    const parsedHTML = lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-base font-bold text-indigo-300 mt-4 mb-2">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} className="text-sm font-bold text-white mt-3 mb-1.5">{line.replace('#### ', '')}</h5>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-lg font-extrabold text-white mt-5 mb-2.5">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-xl font-extrabold text-white mt-6 mb-3 border-b border-white/10 pb-1.5">{line.replace('# ', '')}</h2>;
      }

      // Checklists
      if (line.trim().startsWith('- `[ ]`')) {
        return (
          <div key={idx} className="flex items-center space-x-2 my-1 bg-white/5 p-2 rounded-lg border border-white/5">
            <input type="checkbox" disabled className="rounded-md bg-slate-900 border-white/10 w-4 h-4 text-indigo-500" />
            <span className="text-xs text-slate-300 font-medium">{line.replace('- `[ ]`', '').trim()}</span>
          </div>
        );
      }

      // Bullet points
      if (line.trim().startsWith('- ')) {
        // Parse bold elements in bullet points
        const textContent = line.replace('- ', '').trim();
        return (
          <li key={idx} className="text-xs text-slate-400 leading-relaxed list-disc ml-5 mb-1 font-medium">
            {parseBoldText(textContent)}
          </li>
        );
      }

      // Table parsing
      if (line.includes('|') && line.includes('---')) {
        return null; // Skip markdown separator row
      }
      
      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
        
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
          return null; // Handle rendering on closing or at block level
        } else {
          tableRows.push(cells);
          return null;
        }
      }

      if (inTable && !line.startsWith('|')) {
        // Table finished, render gathered table rows
        inTable = false;
        const currentHeaders = [...tableHeaders];
        const currentRows = [...tableRows];
        tableHeaders = [];
        tableRows = [];
        
        return (
          <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-white/5">
            <table className="w-full text-xs text-left text-slate-400">
              <thead className="bg-slate-900/60 text-slate-300 uppercase font-mono text-[10px] tracking-wider border-b border-white/5">
                <tr>
                  {currentHeaders.map((h, hidx) => (
                    <th key={hidx} className="px-4 py-3 font-extrabold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentRows.map((r, ridx) => (
                  <tr key={ridx} className="bg-slate-950/20 hover:bg-slate-900/40 transition-colors">
                    {r.map((cell, cidx) => (
                      <td key={cidx} className="px-4 py-3 font-medium">
                        {cell.includes('✅') || cell.includes('❌') ? (
                          <span className={cell.includes('✅') ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                            {cell}
                          </span>
                        ) : (
                          parseBoldText(cell)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Normal paragraphs
      if (line.trim() !== '') {
        return <p key={idx} className="text-xs text-slate-300 leading-relaxed font-medium mb-3">{parseBoldText(line)}</p>;
      }

      return <div key={idx} className="h-2"></div>;
    });

    return parsedHTML;
  };

  // Helper to search and bold text enclosed in **
  const parseBoldText = (text) => {
    const parts = text.split('**');
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-indigo-300 font-bold">{part}</strong> : part);
  };

  const quickPrompts = [
    { label: "AI Profile Review", type: "review", desc: "Check general readiness audit" },
    { label: "Skills Gap Analysis", type: "gap", desc: "Current skills vs Target role" },
    { label: "90-Day Learning Roadmap", type: "roadmap", desc: "Generate custom study plan" },
    { label: "Suggest Project Boosts", type: "projects", desc: "Get recommendations for portfolio" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10 w-full h-[calc(100vh-140px)]">
      
      {/* Sidebar Quick Prompts (Left Column) */}
      <aside className="glass-card p-6 flex flex-col space-y-4 lg:col-span-1 shrink-0 h-full overflow-y-auto">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 font-mono block">
            Assistant Prompts
          </span>
          <p className="text-[10px] text-slate-500 mt-1">Calibrated to user targets</p>
        </div>

        <div className="flex-1 flex flex-col space-y-3 pt-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => executeQuickPrompt(prompt.type, prompt.label)}
              disabled={loading}
              className="w-full p-4 rounded-xl text-left bg-slate-950/20 border border-white/5 hover:border-indigo-500/25 hover:bg-indigo-500/5 transition-all text-xs group shrink-0"
            >
              <h4 className="font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                <span>{prompt.label}</span>
                <Sparkles className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-indigo-400" />
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug font-medium">{prompt.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={handleClearHistory}
          className="w-full py-2.5 rounded-xl border border-white/5 hover:border-red-500/20 text-slate-500 hover:text-red-400 transition-all text-xs font-bold flex items-center justify-center space-x-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Chat History</span>
        </button>
      </aside>

      {/* Main Chat Interface (Right Column) */}
      <section className="glass-card flex flex-col lg:col-span-3 h-full overflow-hidden">
        {/* Chat header */}
        <header className="p-4 border-b border-white/5 bg-slate-900/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
                <span>DevLens Advisor</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Calibrated for {targetRole}</p>
            </div>
          </div>
          <Cpu className="w-5 h-5 text-slate-500" />
        </header>

        {/* Messages list */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex space-x-3 w-full max-w-4xl ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse ml-auto justify-end' : 'justify-start'
              }`}
            >
              {/* Profile Icon */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 uppercase' 
                  : 'bg-white/5 text-slate-300'
              }`}>
                {msg.sender === 'user' ? user?.name.charAt(0) : <Bot className="w-4 h-4" />}
              </div>

              {/* Message text bubble */}
              <div className={`p-4 rounded-2xl max-w-[85%] border text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600/10 border-indigo-500/20 text-slate-200'
                  : 'bg-slate-950/20 border-white/5 text-slate-300 shadow-sm'
              }`}>
                {msg.file && (
                  <div className="mb-2.5 p-2 rounded-xl bg-slate-950/40 border border-white/5 flex items-center space-x-2.5 max-w-sm">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="overflow-hidden text-left">
                      <p className="font-bold text-white truncate text-[11px]">{msg.file.originalname}</p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        {msg.file.size ? `${(msg.file.size / (1024 * 1024)).toFixed(2)} MB` : 'Attached File'}
                      </p>
                    </div>
                  </div>
                )}
                
                {msg.sender === 'ai' ? (
                  <div>{renderMarkdown(msg.text)}</div>
                ) : (
                  <p className="font-semibold text-white">{msg.text}</p>
                )}
                <span className="text-[9px] text-slate-500 block text-right mt-2 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Loader typing animation */}
          {loading && (
            <div className="flex space-x-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-white/5 shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-slate-400" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/20 border border-white/5 flex items-center space-x-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-xs uppercase font-extrabold tracking-widest font-mono text-slate-500">Thinking...</span>
              </div>
            </div>
          )}

        </div>

        {/* Selected file preview bar */}
        {selectedFile && (
          <div className="mx-4 mb-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Paperclip className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-indigo-300 font-medium">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleRemoveFile}
              className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input panel (Bottom) */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-slate-900/10 flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx,.csv"
            className="hidden"
          />

          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-indigo-400 hover:text-indigo-300 rounded-lg hover:bg-white/5 transition-all"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={loading}
            placeholder={`Ask about bridging skill gaps for ${targetRole}...`}
            className="flex-1 glass-input rounded-xl py-3 px-4 text-sm font-medium"
          />

          <button type="button" className="p-2.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/5 transition-all">
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={loading || (!inputMsg.trim() && !selectedFile)}
            className="btn-primary p-3 rounded-xl text-white shadow-md disabled:opacity-40 disabled:hover:scale-100 shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </section>

    </div>
  );
};

export default Assistant;
