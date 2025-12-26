import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', responsive = true }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: number;

    const pushAd = () => {
      if (adRef.current && adRef.current.offsetWidth > 0) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          // Silenciosamente falha se o AdSense não estiver pronto
        }
      } else {
        timer = window.setTimeout(pushAd, 200);
      }
    };

    timer = window.setTimeout(pushAd, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={adRef} className="ad-container w-full overflow-hidden">
      <div className="ad-label">Publicidade</div>
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', border: 'none' }}
           data-ad-client="ca-pub-1385455036665566"
           data-ad-slot={slot || "default"}
           data-ad-format={format}
           data-full-width-responsive={responsive ? "true" : "false"}></ins>
    </div>
  );
};

export default AdUnit;