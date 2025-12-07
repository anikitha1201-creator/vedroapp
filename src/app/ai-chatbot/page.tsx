
import ChatInterface from './components/chat-interface';

export default function AiChatbotPage() {
  return (
    <>
      <h1 className="text-4xl font-bold font-headline text-primary mb-8 text-center text-ink-fade">
        Vedro AI (Mini Gemini)
      </h1>
      <ChatInterface />
    </>
  );
}
