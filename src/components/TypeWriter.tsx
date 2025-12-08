import { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  delay?: number;
  startDelay?: number;
  className?: string;
}

const TypeWriter = ({ text, delay = 50, startDelay = 0, className = '' }: TypeWriterProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [displayedText, text, delay, started]);

  return (
    <span className={className}>
      {displayedText}
      {started && displayedText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypeWriter;
