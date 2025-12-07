
import ChatInterface from './components/chat-interface';

export default function AiChatbotPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2 text-ink-fade">
          Vedro AI
        </h1>
        <p className="text-muted-foreground animate-[ink-fade-in_1s_ease-out_0.5s_forwards] opacity-0">
          Your calm and patient guide to learning.
        </p>
      </div>
      <ChatInterface />
    </>
  );
}
