import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import RenovationPhotoGallery from '../components/renovation/RenovationPhotoGallery';
import RenovationDetailsSection from '../components/renovation/RenovationDetailsSection';

const RenovationDetails = memo(() => {
  useSEO({
    title:
      "Charming 80's Ranch Renovation -- Property Details | Skyridge Group",
    description:
      "Completely renovated 80's ranch featuring modern open-concept living at 456 Oak Avenue, Portland OR. 3 bed, 2 bath, 1,850 sqft. Listed at $425,000.",
    keywords: [
      'renovation property',
      'portland real estate',
      "80's ranch",
      'fully renovated home',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-white'>
      <RenovationPhotoGallery />
      <RenovationDetailsSection />
    </div>
  );
});

RenovationDetails.displayName = 'RenovationDetails';

export default RenovationDetails;
