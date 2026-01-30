import React, { useState, useRef, useEffect } from 'react';

// Lightweight designer: draggable + resizable elements (text/image)
export default function Designer({ data, setData, onClose, embed = false, onChange }) {
  const [elements, setElements] = useState(data.designElements || []);
  const [selected, setSelected] = useState(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => setElements(data.designElements || []), [data.designElements]);

  // notify parent when elements change in live/embed mode
  useEffect(() => {
    if (onChange) onChange(elements);
  }, [elements]);

  const addText = () => {
    const el = {
      id: Date.now(),
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 80,
      content: 'New text',
      color: '#ffffff',
      fontSize: 24
    };
    setElements(e => [...e, el]);
    setSelected(el.id);
  };

  const addImage = file => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const el = {
        id: Date.now(),
        type: 'image',
        x: 60,
        y: 60,
        width: 240,
        height: 160,
        src: ev.target.result
      };
      setElements(e => [...e, el]);
      setSelected(el.id);
    };
    reader.readAsDataURL(file);
  };

  // Drag handlers
  const onMouseDown = (e, id) => {
    e.stopPropagation();
    const el = elements.find(x => x.id === id);
    if (!el) return;
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = e => {
    if (dragRef.current) {
      const { id, startX, startY, origX, origY } = dragRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // snap to 8px grid
      const nx = Math.round((origX + dx) / 8) * 8;
      const ny = Math.round((origY + dy) / 8) * 8;
      setElements(prev => prev.map(el => el.id === id ? { ...el, x: nx, y: ny } : el));
    }
    if (resizeRef.current) {
      const { id, startX, startY, origW, origH } = resizeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const nw = Math.max(20, origW + dx);
      const nh = Math.max(20, origH + dy);
      setElements(prev => prev.map(el => el.id === id ? { ...el, width: Math.round(nw/4)*4, height: Math.round(nh/4)*4 } : el));
    }
  };

  const onMouseUp = () => {
    dragRef.current = null;
    resizeRef.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  const onResizeStart = (e, id) => {
    e.stopPropagation();
    const el = elements.find(x => x.id === id);
    if (!el) return;
    resizeRef.current = { id, startX: e.clientX, startY: e.clientY, origW: el.width, origH: el.height };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const updateSelected = patch => {
    setElements(prev => prev.map(el => el.id === selected ? { ...el, ...patch } : el));
  };

  const removeSelected = () => {
    if (!selected) return;
    setElements(prev => prev.filter(el => el.id !== selected));
    setSelected(null);
  };

  const bringForward = () => {
    if (!selected) return;
    setElements(prev => {
      const arr = [...prev];
      const idx = arr.findIndex(x => x.id === selected);
      if (idx < 0) return prev;
      if (idx === arr.length - 1) return prev;
      const [item] = arr.splice(idx, 1);
      arr.splice(idx + 1, 0, item);
      return arr;
    });
  };

  const sendBack = () => {
    if (!selected) return;
    setElements(prev => {
      const arr = [...prev];
      const idx = arr.findIndex(x => x.id === selected);
      if (idx <= 0) return prev;
      const [item] = arr.splice(idx, 1);
      arr.splice(idx - 1, 0, item);
      return arr;
    });
  };

  const saveAndClose = () => {
    setData(p => ({ ...p, designElements: elements }));
    if (onClose) onClose();
  };

  // Export canvas to PNG
  const exportPNG = async () => {
    const width = 1200;
    const height = 800;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // draw background
    if (data.bgImages[0]) {
      const bg = new Image();
      bg.crossOrigin = 'anonymous';
      bg.src = data.bgImages[0];
      await new Promise(r => { bg.onload = r; bg.onerror = r; });
      ctx.drawImage(bg, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#00000000';
      ctx.fillRect(0,0,width,height);
    }
    // draw elements in order
    for (const el of elements) {
      const x = Math.round((el.x/800)*width);
      const y = Math.round((el.y/600)*height);
      const w = Math.round((el.width/800)*width);
      const h = Math.round((el.height/600)*height);
      if (el.type === 'image') {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.src = el.src;
        // await load
        await new Promise(r => { im.onload = r; im.onerror = r; });
        ctx.drawImage(im, x, y, w, h);
      } else {
        ctx.fillStyle = el.color || '#fff';
        ctx.font = `${el.fontSize || 18}px sans-serif`;
        ctx.textBaseline = 'top';
        wrapText(ctx, el.content || '', x, y, w, el.fontSize || 18);
      }
    }
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.png';
    a.click();
  };

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  return (
    <div className={embed ? 'relative w-full h-full' : 'fixed inset-0 bg-black/60 z-50 flex'}>
      {!embed && (
        <div className="w-80 bg-white text-black p-4 overflow-auto">
          <h3 className="font-bold mb-2">Designer</h3>
          <div className="space-y-2">
            <button className="w-full bg-slate-800 text-white py-2 rounded" onClick={addText}>Add Text</button>
            <label className="block">
              <div className="w-full bg-slate-200 text-center py-2 rounded cursor-pointer">Add Image</div>
              <input type="file" accept="image/*" className="hidden" onChange={e => addImage(e.target.files && e.target.files[0])} />
            </label>
            <button onClick={exportPNG} className="w-full bg-blue-600 text-white py-2 rounded">Export PNG</button>
            <div className="pt-2">
              <p className="text-sm opacity-70">Selected</p>
              {selected ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button onClick={bringForward} className="px-2 py-1 bg-slate-200 rounded">Forward</button>
                    <button onClick={sendBack} className="px-2 py-1 bg-slate-200 rounded">Back</button>
                  </div>
                  <button onClick={removeSelected} className="w-full bg-red-500 text-white py-1 rounded">Delete</button>
                  {(() => {
                    const el = elements.find(x => x.id === selected);
                    if (!el) return null;
                    if (el.type === 'text') return (
                      <div className="space-y-2">
                        <input value={el.content} onChange={e => updateSelected({ content: e.target.value })} className="w-full p-2 border rounded" />
                        <div className="flex gap-2">
                          <input type="color" value={el.color || '#ffffff'} onChange={e => updateSelected({ color: e.target.value })} />
                          <input type="number" value={el.fontSize || 24} onChange={e => updateSelected({ fontSize: Number(e.target.value) || 12 })} className="w-20 p-1 border rounded" />
                        </div>
                      </div>
                    );
                    if (el.type === 'image') return (
                      <div className="text-sm opacity-70">Image selected</div>
                    );
                    return null;
                  })()}
                </div>
              ) : <div className="opacity-50">No selection</div>}
            </div>
            <div className="pt-4 flex gap-2">
              <button onClick={saveAndClose} className="flex-1 bg-green-600 text-white py-2 rounded">Save</button>
              <button onClick={() => onClose && onClose()} className="flex-1 bg-gray-200 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className={embed ? 'absolute inset-0' : 'flex-1 relative'} onMouseDown={() => setSelected(null)}>
        <div ref={canvasRef}
             className="absolute inset-0 bg-cover bg-center"
             style={{
               backgroundImage: data.bgImages[0] ? `url(${data.bgImages[0]})` : undefined,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
          {/* grid overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(#ffffff08 0 1px, transparent 1px 8px), repeating-linear-gradient(90deg,#ffffff08 0 1px, transparent 1px 8px)' }} />
          {elements.map(el => (
            <div key={el.id}
                 style={{ left: el.x, top: el.y, width: el.width, height: el.height, position: 'absolute', cursor: selected === el.id ? 'grabbing' : 'grab' }}
                 onMouseDown={e => { setSelected(el.id); onMouseDown(e, el.id); }}>
              {el.type === 'text' ? (
                <div style={{ color: el.color || '#fff', fontSize: el.fontSize || 18, width: '100%', height: '100%', overflow: 'hidden' }}>
                  {el.content}
                </div>
              ) : (
                <img src={el.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div onMouseDown={e => onResizeStart(e, el.id)} style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: 'white', borderRadius: 2, cursor: 'nwse-resize' }} />
            </div>
          ))}
        </div>

        {/* embed toolbar */}
        {embed && (
          <div style={{ position: 'absolute', right: 12, top: 12, display: 'flex', gap: 8 }}>
            <button onClick={exportPNG} className="bg-white/90 text-black px-3 py-1 rounded">Export</button>
            <button onClick={() => { if (onClose) onClose(); }} className="bg-white/30 text-white px-3 py-1 rounded border">Open</button>
          </div>
        )}
      </div>
    </div>
  );
}
