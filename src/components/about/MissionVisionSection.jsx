import React, { memo } from 'react';

const ASSETS = {
  missionMain: '/AboutUs/missionMain.webp',
  missionSecond: '/AboutUs/missionSecond.webp',
  visionMain: '/AboutUs/visionMain.webp',
  visionSecond: '/AboutUs/visionSecond.webp',
};

const MissionVisionCluster = memo(
  ({ accentColor, mainImage, mainAlt, secondImage, secondAlt, size }) => {
    const isLarge = size === 'full';
    const w = isLarge ? 668 : 500;
    const h = isLarge ? 380 : 285;
    const scale = isLarge ? 1 : 0.748;
    const pos = {
      accentW: Math.round(294 * scale),
      accentH: Math.round(236 * scale),
      mainL: Math.round(24 * scale),
      mainT: Math.round(20 * scale),
      mainW: Math.round(423 * scale),
      mainH: Math.round(340 * scale),
      secL: Math.round(373 * scale),
      secT: Math.round(74 * scale),
      secW: Math.round(294 * scale),
      secH: Math.round(236 * scale),
    };

    return (
      <div
        className='relative shrink-0'
        style={{ width: `${w}px`, height: `${h}px` }}
        aria-hidden='true'
      >
        {/* Accent color box */}
        <div
          className='absolute rounded-lg'
          style={{
            left: 0,
            top: 0,
            width: `${pos.accentW}px`,
            height: `${pos.accentH}px`,
            backgroundColor: accentColor,
          }}
        />
        {/* Main image */}
        <div
          className='absolute rounded-lg overflow-hidden border border-white shadow-lg'
          style={{
            left: `${pos.mainL}px`,
            top: `${pos.mainT}px`,
            width: `${pos.mainW}px`,
            height: `${pos.mainH}px`,
          }}
        >
          <img
            src={mainImage}
            alt={mainAlt}
            className='absolute inset-0 w-full h-full object-cover rounded-lg'
            loading='lazy'
          />
        </div>
        {/* Second image */}
        <div
          className='absolute rounded-lg overflow-hidden border border-white shadow-md'
          style={{
            left: `${pos.secL}px`,
            top: `${pos.secT}px`,
            width: `${pos.secW}px`,
            height: `${pos.secH}px`,
          }}
        >
          <img
            src={secondImage}
            alt={secondAlt}
            className='absolute inset-0 w-full h-full object-cover rounded-lg'
            loading='lazy'
          />
        </div>
      </div>
    );
  },
);
MissionVisionCluster.displayName = 'MissionVisionCluster';

const MissionVisionSection = memo(() => (
  <section
    className='bg-blue-tint py-14 lg:py-20'
    aria-label='Our mission and vision'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-16 lg:gap-20'>
      {/* Row 1: Mission -- image cluster LEFT, text RIGHT */}
      <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
        {/* Full cluster -- xl+ */}
        <div className='hidden xl:block'>
          <MissionVisionCluster
            accentColor='#1e3a8a'
            mainImage={ASSETS.missionMain}
            mainAlt='Real estate professionals collaborating on a mission'
            secondImage={ASSETS.missionSecond}
            secondAlt='Property handshake agreement'
            size='full'
          />
        </div>
        {/* Simplified cluster -- lg only */}
        <div className='hidden lg:block xl:hidden'>
          <MissionVisionCluster
            accentColor='#1e3a8a'
            mainImage={ASSETS.missionMain}
            mainAlt='Real estate professionals'
            secondImage={ASSETS.missionSecond}
            secondAlt='Property agreement'
            size='compact'
          />
        </div>
        {/* Mobile -- single image */}
        <div className='lg:hidden w-full max-w-sm rounded-xl overflow-hidden shadow-lg'>
          <img
            src={ASSETS.missionMain}
            alt='Our mission -- real estate professionals'
            className='w-full h-56 object-cover'
            loading='lazy'
          />
        </div>

        {/* Text */}
        <div className='flex flex-col gap-6 flex-1 min-w-0'>
          <h2 className='font-playfair text-black text-3xl lg:text-4xl font-semibold leading-tight'>
            Our Mission
          </h2>
          <div className='text-slate-700 text-base leading-7 flex flex-col gap-4'>
            <p>
              To simplify real estate buying and selling by providing reliable
              listings, expert guidance, and complete support throughout the
              process.
            </p>
            <p>
              We aim to make property ownership accessible, safe, and
              stress-free for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Vision -- text LEFT, image cluster RIGHT */}
      <div className='flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16'>
        {/* Text */}
        <div className='flex flex-col gap-6 flex-1 min-w-0'>
          <h2 className='font-playfair text-black text-3xl lg:text-4xl font-semibold leading-tight'>
            Our Vision
          </h2>
          <p className='text-slate-700 text-base leading-7'>
            We envision a future where finding a home is fast, transparent, and
            fully digital. Our goal is to become the most trusted real estate
            platform in the region.
          </p>
        </div>

        {/* Full cluster -- xl+ */}
        <div className='hidden xl:block'>
          <MissionVisionCluster
            accentColor='#ea580c'
            mainImage={ASSETS.visionMain}
            mainAlt='Digital real estate technology -- our vision'
            secondImage={ASSETS.visionSecond}
            secondAlt='Smart property management interface'
            size='full'
          />
        </div>
        {/* Simplified cluster -- lg only */}
        <div className='hidden lg:block xl:hidden'>
          <MissionVisionCluster
            accentColor='#ea580c'
            mainImage={ASSETS.visionMain}
            mainAlt='Digital real estate'
            secondImage={ASSETS.visionSecond}
            secondAlt='Smart property'
            size='compact'
          />
        </div>
        {/* Mobile -- single image */}
        <div className='lg:hidden w-full max-w-sm rounded-xl overflow-hidden shadow-lg'>
          <img
            src={ASSETS.visionMain}
            alt='Our vision -- digital real estate'
            className='w-full h-56 object-cover'
            loading='lazy'
          />
        </div>
      </div>
    </div>
  </section>
));

MissionVisionSection.displayName = 'MissionVisionSection';

export default MissionVisionSection;
