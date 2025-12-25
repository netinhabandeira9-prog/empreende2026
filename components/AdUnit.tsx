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
      // Verifica se o container tem largura para evitar o erro availableWidth=0
      if (adRef.current && adRef.current.offsetWidth > 0) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error("AdSense push error:", e);
        }
      } else {
        // Se a largura for 0 (ex: renderização inicial ou oculto), tenta novamente no próximo frame
        timer = window.setTimeout(pushAd, 100);
      }
    };

    // Pequeno delay para garantir que o layout do Flexbox/Grid foi calculado
    timer = window.setTimeout(pushAd, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={adRef} className="ad-container relative w-full overflow-hidden flex justify-center">
      <span className="ad-label">Publicidade</span>
      <ins className="adsbygoogle"
           style={{ display: 'block', minWidth: '250px', width: '100%' }}
           data-ad-client="ca-pub-1385455036665566"
           data-ad-slot={slot || "default"}
           data-ad-format={format}
           data-full-width-responsive={responsive ? "true" : "false"}></ins>
    </div>
  );
};

export default AdUnit;