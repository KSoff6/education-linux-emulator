import React, { useState, useRef } from "react";

export default function CommandPanel() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState([]);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // стартовая позиция окна
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // Команды
  const handleCommand = (command) => {
    switch (command.toLowerCase()) {
      case "hello":
        return "Привет!";
      case "time":
        return new Date().toLocaleTimeString();
      case "clear":
        setOutput([]);
        return null;

      default:
        return `Команда "${command}" не распознана`;
    }
  };

  // Отправка команды
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const result = handleCommand(input);

    if (input.toLowerCase() === "clear") {
      setHistory([...history, input]);
      setInput("");
      setHistoryIndex(-1);
      return;
    }

    setOutput([...output, `> ${input}`, result]);
    setHistory([...history, input]);
    setInput("");
    setHistoryIndex(-1);
  };

  // Навигация по истории
  const handleKey = (e) => {
    if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      const newIndex =
        historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    }
    if (e.key === "ArrowDown") {
      if (history.length === 0) return;
      const newIndex =
        historyIndex >= history.length - 1 ? -1 : historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex]);
    }
  };

  // --- Перетаскивание окна ---
  const startDrag = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const endDrag = () => setDragging(false);

  // --- Само окно ---
  return (
    <div
      className="fixed z-50 shadow-xl rounded-md w-[500px] bg-gray-950 border border-gray-700"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: dragging ? "grabbing" : "default",
      }}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
    >
      {/* Заголовок для перетаскивания */}
      <div
        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-t-md flex justify-between items-center cursor-grab"
        onMouseDown={startDrag}
        onMouseUp={endDrag}
      >
        <span className="text-sm select-none">Kiss Command panel</span>
      </div>

      {/* Терминал */}
      <section className="text-green-400 font-mono p-4 h-[300px] overflow-y-auto">
        {output.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="mr-2">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="bg-transparent text-green-400 focus:outline-none flex-1"
            autoFocus
          />
        </form>
      </section>
    </div>
  );
}
