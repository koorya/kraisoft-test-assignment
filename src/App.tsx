import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const size = 100;

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const cont = container.current?.getBoundingClientRect();
    if (!cont) return;
    setPosition({
      x: cont.width / 2 - size / 2,
      y: cont.height / 2 - size / 2,
    });
  }, []);
  const container = useRef<HTMLDivElement>(null);

  const moveHandler = (
    clientX: number,
    clientY: number,
    isPressed: boolean
  ) => {
    if (!isDragging) return;
    if (!isPressed) {
      setIsDragging(false);
      return;
    }
    const cont = container.current?.getBoundingClientRect();
    if (!cont) return;

    const calcPosition = (
      x: number,
      size: number,
      offset: number,
      width: number
    ) =>
      x + (size - offset) > width ? width - size : x < offset ? 0 : x - offset;

    const x = Math.round(clientX - cont.left);
    const y = Math.round(clientY - cont.top);
    setPosition({
      x: calcPosition(x, size, offset.x, cont.width),
      y: calcPosition(y, size, offset.y, cont.height),
    });
  };

  const movableHandle = (clientX: number, clientY: number) => {
    const cont = container.current?.getBoundingClientRect();
    if (!cont) return;
    const x = Math.round(clientX - cont.left);
    const y = Math.round(clientY - cont.top);
    setOffset({ x: x - position.x, y: y - position.y });

    setIsDragging(true);
  };
  return (
    <div
      className="Container"
      onMouseMove={(e) => moveHandler(e.clientX, e.clientY, !!e.buttons)}
      onTouchMove={(e) =>
        moveHandler(e.touches[0].clientX, e.touches[0].clientY, true)
      }
      onTouchEnd={() => setIsDragging(false)}
      ref={container}
    >
      <div
        className="MovableBox"
        onMouseDown={(e) => movableHandle(e.clientX, e.clientY)}
        onTouchStart={(e) =>
          movableHandle(e.touches[0].clientX, e.touches[0].clientY)
        }
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        Move me!
      </div>
    </div>
  );
}

export default App;
