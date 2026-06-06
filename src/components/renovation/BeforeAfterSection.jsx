import React, { memo, useState, useCallback, useRef, useEffect } from 'react';

const BEFORE_AFTER = [
  {
    id: 'kitchen',
    title: 'Modern Kitchen Transformation',
    caption: 'Drag the slider to compare before and after',
    before: '/BuildAndRenovate/before1.webp',
    after: '/BuildAndRenovate/after1.webp',
    beforeAlt: 'Kitchen before renovation',
    afterAlt: 'Kitchen after renovation',
  },
  {
    id: 'bathroom',
    title: 'Luxury Bathroom Upgrade',
    caption: 'Drag the slider to compare before and after',
    before: '/BuildAndRenovate/before2.webp',
    after: '/BuildAndRenovate/after2.webp',
    beforeAlt: 'Bathroom before renovation',
    afterAlt: 'Bathroom after renovation',
  },
  {
    id: 'living',
    title: 'Living Room Redesign',
    caption: 'Drag the slider to compare before and after',
    before: '/BuildAndRenovate/before3.webp',
    after: '/BuildAndRenovate/after3.webp',
    beforeAlt: 'Living room before renovation',
    afterAlt: 'Living room after renovation',
  },
];

const BeforeAfterSlider = memo(({ item }) => {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const getPosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * 100;
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const handleTouchStart = useCallback(() => {
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e) => setPosition(getPosition(e.clientX));
    const onTouchMove = (e) => setPosition(getPosition(e.touches[0].clientX));
    const onEnd = () => setDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [dragging, getPosition]);

  return (
    <div className='bg-white rounded-[14px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col'>
      <div
        ref={containerRef}
        className='relative h-65 select-none cursor-ew-resize shrink-0 overflow-hidden'
        role='img'
        aria-label={`${item.title} before and after comparison`}
      >
        <img
          src={item.after}
          alt={item.afterAlt}
          className='absolute inset-0 size-full object-cover pointer-events-none'
          draggable='false'
        />
        <img
          src={item.before}
          alt={item.beforeAlt}
          className='absolute inset-0 size-full object-cover pointer-events-none'
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          draggable='false'
          aria-hidden='true'
        />
        <div
          className='absolute top-0 bottom-0 w-1 bg-white shadow-lg'
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          aria-hidden='true'
        />
        <button
          type='button'
          className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-ew-resize focus-visible:outline-2 focus-visible:outline-blue-500'
          style={{ left: `${position}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          aria-label='Drag to compare before and after'
        >
          <div className='flex items-center gap-1' aria-hidden='true'>
            <div className='w-1 h-4 rounded-sm bg-muted-slate' />
            <div className='w-1 h-4 rounded-sm bg-muted-slate' />
          </div>
        </button>
        <span className='absolute top-4 left-4 bg-black/70 text-white text-sm font-normal px-3 py-1 rounded-sm pointer-events-none'>
          Before
        </span>
        <span className='absolute top-4 right-4 bg-black/70 text-white text-sm font-normal px-3 py-1 rounded-sm pointer-events-none'>
          After
        </span>
      </div>
      <div className='p-4 flex flex-col gap-1 items-center text-center'>
        <h3 className='font-semibold text-ink-soft text-base leading-snug'>
          {item.title}
        </h3>
        <p className='text-ink-caption text-xs leading-relaxed'>{item.caption}</p>
      </div>
    </div>
  );
});
BeforeAfterSlider.displayName = 'BeforeAfterSlider';

const BeforeAfterSection = memo(() => (
  <section
    className='bg-surface-off py-14 lg:py-20 '
    aria-labelledby='before-after-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <h2
        id='before-after-heading'
        className='text-center font-bold text-ink-soft text-3xl sm:text-4xl leading-tight mb-14'
      >
        Before &amp; After Transformations
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
        {BEFORE_AFTER.map((item) => (
          <BeforeAfterSlider key={item.id} item={item} />
        ))}
      </div>
    </div>
  </section>
));

BeforeAfterSection.displayName = 'BeforeAfterSection';

export default BeforeAfterSection;
