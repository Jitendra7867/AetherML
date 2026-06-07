import { useState, useEffect } from 'react';
import { AlignLeft } from 'lucide-react';

interface HeaderItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<HeaderItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Look for all headers within the theory section
    const elements = Array.from(document.querySelectorAll('.theory-content h2'))
      .map(elem => {
        // Ensure each element has a valid ID
        if (!elem.id) {
          elem.id = elem.textContent
            ? elem.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            : Math.random().toString(36).substring(2, 9);
        }
        return {
          id: elem.id,
          text: elem.textContent || ''
        };
      });
    
    setHeadings(elements);

    // Intersection observer to track which heading is currently on screen
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    elements.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      elements.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings.length]); // Re-run when contents size changes

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24 max-h-[calc(100vh-160px)] overflow-y-auto w-52 shrink-0 hidden xl:block pl-4 border-l border-slate-100">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
        <AlignLeft size={13} />
        <span>On This Page</span>
      </div>

      <nav className="space-y-2.5">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className={`block text-xs font-medium transition-all duration-150 leading-relaxed border-l-2 pl-3 -ml-px ${
              activeId === heading.id
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
