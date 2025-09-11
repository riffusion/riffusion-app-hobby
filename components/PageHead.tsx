import { useEffect } from "react";

export default function PageHead() {
  useEffect(() => {
    document.title = "Riffusion";
    
    // Set meta tags
    const setMeta = (name: string, content: string, property = false) => {
      let meta = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('og:site_name', 'Riffusion', true);
    setMeta('article:author', 'Seth Forsgren and Hayk Martiros', true);
    setMeta('article:tag', 'music', true);
    setMeta('og:title', 'Riffusion', true);
    setMeta('twitter:title', 'Riffusion');
    setMeta('description', 'Stable diffusion for real-time music generation');
    setMeta('og:description', 'Stable diffusion for real-time music generation', true);
    setMeta('twitter:description', 'Stable diffusion for real-time music generation');
    setMeta('twitter:card', 'summary');
    setMeta('og:image', 'https://i.imgur.com/fywZpQ7.jpeg', true);
    setMeta('twitter:image', 'https://i.imgur.com/fywZpQ7.jpeg');
    setMeta('og:type', 'website', true);
    setMeta('og:url', 'http://www.riffusion.', true);
    setMeta('og:locale', 'en_US', true);
    setMeta('og:website', 'http://wwww.riffusion', true);
  }, []);

  return null;
}
