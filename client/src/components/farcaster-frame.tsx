import { useEffect } from 'react';
import { Contest } from '@shared/schema';

interface FarcasterFrameProps {
  contest: Contest;
}

export function FarcasterFrame({ contest }: FarcasterFrameProps) {
  useEffect(() => {
    // Add Open Graph meta tags for Farcaster frame
    const addMetaTag = (property: string, content: string) => {
      const existingTag = document.querySelector(`meta[property="${property}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Frame metadata
    addMetaTag('fc:frame', 'vNext');
    addMetaTag('fc:frame:title', contest.title);
    addMetaTag('fc:frame:description', contest.description);
    addMetaTag('fc:frame:image', `${window.location.origin}/api/frames/contest/${contest.id}/image`);
    addMetaTag('fc:frame:button:1', 'Join Contest');
    addMetaTag('fc:frame:button:1:action', 'post');
    addMetaTag('fc:frame:button:1:target', `${window.location.origin}/api/frames/contest/${contest.id}/join`);
    addMetaTag('fc:frame:button:2', 'View Details');
    addMetaTag('fc:frame:button:2:action', 'link');
    addMetaTag('fc:frame:button:2:target', `${window.location.origin}/contest/${contest.id}`);

    // Open Graph metadata
    addMetaTag('og:title', `🏆 ${contest.title}`);
    addMetaTag('og:description', `${contest.description} | Prize Pool: ${contest.prizePool} ETH`);
    addMetaTag('og:image', `${window.location.origin}/api/frames/contest/${contest.id}/image`);
    
    return () => {
      // Cleanup meta tags when component unmounts
      const frameTags = document.querySelectorAll('meta[property^="fc:frame"]');
      frameTags.forEach(tag => tag.remove());
    };
  }, [contest]);

  return null; // This component only manages meta tags
}

export default FarcasterFrame;
