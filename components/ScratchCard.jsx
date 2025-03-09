'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

const ScratchCard = ({ discount, isLucky, isRevealed, onScratchComplete }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const totalScratched = useRef(0);
  const brushSize = 15;
  const scratchThreshold = useRef(0);

  useEffect(() => {
    if (canvasRef.current && !ctx) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = 150;
      canvas.height = 200;
      context.fillStyle = 'gray';
      context.fillRect(0, 0, canvas.width, canvas.height);
      scratchThreshold.current = canvas.width * canvas.height * 0.5;
      setCtx(context);
    }
  }, [ctx]);

  const getPosition = useCallback((event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  const handleScratch = useCallback((event) => {
    if (!ctx || isRevealed) return;
    
    const pos = getPosition(event);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    totalScratched.current += Math.PI * brushSize * brushSize;
    if (totalScratched.current >= scratchThreshold.current) {
      onScratchComplete();
    }
  }, [ctx, getPosition, isRevealed, onScratchComplete]);

  const startDragging = useCallback((e) => {
    setIsDragging(true);
    handleScratch(e);
  }, [handleScratch]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const events = {
      mousedown: startDragging,
      mousemove: handleScratch,
      mouseup: stopDragging,
      mouseleave: stopDragging,
      touchstart: startDragging,
      touchmove: handleScratch,
      touchend: stopDragging,
    };

    Object.entries(events).forEach(([event, handler]) => {
      canvas.addEventListener(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        canvas.removeEventListener(event, handler);
      });
    };
  }, [startDragging, handleScratch, stopDragging]);

  return (
    <div className="relative w-[150px] h-[200px] rounded-lg overflow-hidden shadow-lg">
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 ${isRevealed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}
      />
      <div className={`w-full h-full flex items-center justify-center text-white text-xl font-bold 
        ${isRevealed ? (isLucky ? 'bg-yellow-500' : 'bg-blue-500') : 'bg-gray-500'} 
        transition-colors duration-500`}>
        {isRevealed ? discount : 'Scratch Me'}
      </div>
    </div>
  );
};

export default ScratchCard;