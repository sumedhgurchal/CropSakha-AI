'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

const API_URL = 'http://localhost:8000';

export default function GeminiAssistant({ context = "" }: { context?: string }) {
  const { language } = useI18n();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: context })
      });

      if (!response.ok) throw new Error('Chat API failed');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to Gemini.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '300px', maxHeight: '400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>✨</span>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Gemini AI Assistant</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
            <p>Ask me anything about your crop scan or agronomy!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? 'var(--accent)' : '#F1F5F9',
            color: msg.role === 'user' ? '#FFFFFF' : 'var(--text-primary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            maxWidth: '85%',
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
            <span style={{ animation: 'pulse 1.5s infinite' }}>Gemini is thinking...</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your question..." 
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', outline: 'none' }}
        />
        <button 
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ 
            padding: '0 1.25rem', 
            borderRadius: 'var(--radius-full)', 
            backgroundColor: 'var(--accent)', 
            color: '#FFF', 
            border: 'none', 
            cursor: 'pointer',
            opacity: loading || !input.trim() ? 0.7 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
