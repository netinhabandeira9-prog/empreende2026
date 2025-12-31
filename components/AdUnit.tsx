
import React, { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', responsive = true }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay estratégico para garantir que o conteúdo principal (Blog/Textos) 
    // já esteja renderizado antes de solicitar o anúncio ao Google.
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldLoad && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push error:", e);
      }
    }
  }, [shouldLoad]);

  return (
    <div ref={adRef} className="ad-container w-full overflow-hidden bg-gray-50/50 border border-gray-100/50">
      <div className="ad-label">Publicidade</div>
      {shouldLoad && (
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', minHeight: '100px', border: 'none' }}
             data-ad-client="ca-pub-1385455036665566"
             data-ad-slot={slot || "default"}
             data-ad-format={format}
             data-full-width-responsive={responsive ? "true" : "false"}></ins>
      )}
    </div>
  );
};

export default AdUnit;
