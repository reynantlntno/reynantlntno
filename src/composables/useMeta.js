import { nextTick } from 'vue';

export function useMeta() {
  const setMeta = ({
    title,
    description,
    keywords,
    image = '/images/social-share.jpg',
    url,
    type = 'website'
  }) => {
    nextTick(() => {
      // Update basic meta tags
      document.title = title ? `${title} | Reynan Tolentino` : 'Reynan Tolentino | Software Developer';
      
      // Find or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description || 'Professional portfolio of Reynan Tolentino, a software developer specializing in modern web applications.');
      
      // Find or create meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords || 'software developer, web development, vue.js, react, nodejs, portfolio');
      
      // Open Graph tags
      updateOrCreateMetaTag('og:title', title ? `${title} | Reynan Tolentino` : 'Reynan Tolentino | Software Developer');
      updateOrCreateMetaTag('og:description', description || 'Professional portfolio of Reynan Tolentino, a software developer specializing in modern web applications.');
      updateOrCreateMetaTag('og:image', image);
      updateOrCreateMetaTag('og:url', url || 'https://reynantlntno.netlify.app');
      updateOrCreateMetaTag('og:type', type);
      
      // Twitter Card tags
      updateOrCreateMetaTag('twitter:card', 'summary_large_image');
      updateOrCreateMetaTag('twitter:title', title ? `${title} | Reynan Tolentino` : 'Reynan Tolentino | Software Developer');
      updateOrCreateMetaTag('twitter:description', description || 'Professional portfolio of Reynan Tolentino, a software developer specializing in modern web applications.');
      updateOrCreateMetaTag('twitter:image', image);
    });
  };
  
  const updateOrCreateMetaTag = (property, content) => {
    let metaTag = document.querySelector(`meta[property="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  };
  
  return {
    setMeta
  };
}