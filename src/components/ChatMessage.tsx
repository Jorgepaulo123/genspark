import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Message } from '../types/chat';
import { Bot, User, Pen } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [isTyping, setIsTyping] = useState(message.role === 'assistant');

  return (
    <div className={`flex gap-3 ${message.role === 'assistant' ? 'bg-white dark:bg-gray-800/50 shadow-lg' : ''} p-6 rounded-xl transition-colors duration-200`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        message.role === 'assistant' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'
      }`}>
        {message.role === 'assistant' ? (
          isTyping ? (
            <Pen className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-bounce" />
          ) : (
            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          )
        ) : (
          <User className="w-6 h-6 text-green-600 dark:text-green-400" />
        )}
      </div>
      <div className="flex-1">
        {message.image && (
          <img 
            src={message.image} 
            alt="Conteúdo enviado"
            className="max-w-sm rounded-lg mb-4 shadow-md"
          />
        )}
        {message.role === 'assistant' ? (
          <div className="prose dark:prose-invert prose-blue max-w-none">
            <TypewriterText 
              text={message.content}
              speed={30}
              onComplete={() => setIsTyping(false)}
            />
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={dracula}
                    PreTag="div"
                    className="rounded-lg shadow-md"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={`${className} bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`} {...props}>
                    {children}
                  </code>
                );
              }
            }}
            className="prose dark:prose-invert prose-blue max-w-none"
          >
            {message.content}
          </ReactMarkdown>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          {message.timestamp.toLocaleTimeString('pt-BR')}
        </div>
      </div>
    </div>
  );
}