import React, { useEffect, useState } from 'react';
import { getGroundedResponse } from '../lib/groundedCounsel';
import { loadProvider } from '../lib/storage';
import { Button, Input, Section } from '../ui';

interface CounselorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  uncertainty?: string;
}

const SAMPLE_QUESTIONS = [
  'I have 85% in FSc Pre-Engineering. Which programs should I explore?',
  'My annual budget is PKR 15 lakh. Which options are affordable?',
  "Can I apply to an Italian bachelor's program with Pakistani qualifications?",
  'Which scholarships might cover tuition and living expenses?',
  'Why did this university appear in my shortlist?',
  'What should I do next if I do not have IELTS?',
];

export function AICounselor() {
  const [messages, setMessages] = useState<CounselorMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [notice, setNotice] = useState('Checking AI provider configuration…');

  useEffect(() => {
    void fetch('/api/ai/status')
      .then((response) => (response.ok ? response.json() : { gemini: false, nebius: false }))
      .then((status: { gemini?: boolean; nebius?: boolean }) => {
        const provider = loadProvider();
        const ready = provider === 'nebius' ? Boolean(status.nebius) : Boolean(status.gemini);
        setConfigured(ready);
        setNotice(
          ready
            ? 'Live AI counseling is available through the server-side provider.'
            : 'No server API key is configured. Grounded sample responses are used until you add credentials to `.env`.',
        );
      })
      .catch(() => {
        setConfigured(false);
        setNotice('The counselor API is unavailable. Grounded sample responses are shown instead.');
      });
  }, []);

  const sendMessage = async (content: string) => {
    const question = content.trim();
    if (!question || isLoading) return;

    setMessages((prev) => [...prev, { id: `${Date.now()}-u`, role: 'user', content: question }]);
    setInput('');
    setIsLoading(true);

    let reply = getGroundedResponse(question);
    try {
      const response = await fetch('/api/counsel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, provider: loadProvider() }),
      });
      if (response.ok) {
        reply = (await response.json()) as typeof reply;
      }
    } catch {
      // Keep the grounded sample answer; do not invent a live AI reply.
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: reply.content,
        sources: reply.sources,
        uncertainty: reply.uncertainty,
      },
    ]);
    setIsLoading(false);
  };

  return (
    <div>
      <Section>
        <h1 className="mb-6 text-3xl font-bold tracking-tight">AI University Counselor</h1>
        <p className="mb-8 text-muted-foreground">
          Ask about universities, admissions, scholarships, or application planning. Live answers use the server-side provider when configured.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-2 md:grid-cols-2">
          {SAMPLE_QUESTIONS.map((question) => (
            <Button
              key={question}
              variant="outline"
              className="h-auto whitespace-normal px-3 py-2 text-left text-sm text-muted-foreground"
              onClick={() => void sendMessage(question)}
            >
              {question}
            </Button>
          ))}
        </div>

        <div className="mb-6 h-[420px] space-y-4 overflow-y-auto rounded-md border border-border bg-white p-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">Suggested questions are above. Type your own question below.</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'ml-auto bg-primary/10 text-primary' : 'bg-muted text-foreground'}`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-1 text-xs text-muted-foreground">{msg.sources.join(' · ')}</div>
              )}
              {msg.uncertainty && <div className="mt-1 text-xs text-muted-foreground">{msg.uncertainty}</div>}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void sendMessage(input);
            }}
          />
          <Button variant="primary" disabled={isLoading || !input.trim()} onClick={() => void sendMessage(input)}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>

        <div className={`mt-6 rounded-xl border p-4 text-sm ${configured ? 'border-primary/20 bg-primary/5' : 'border-yellow-200 bg-yellow-50 text-yellow-800'}`}>
          <p>{notice}</p>
        </div>
      </Section>
    </div>
  );
}

export default AICounselor;
