import { PortableText } from 'next-sanity';

interface PortableTextContentProps {
  value: any;
}

export default function PortableTextContent({ value }: PortableTextContentProps) {
  if (!value) return null;

  return (
    <PortableText
      value={value}
      components={{
        block: {
          h2: ({ children }) => (
            <h2 className="text-2xl md:text-3xl font-black mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl md:text-2xl font-black mb-3">{children}</h3>
          ),
          normal: ({ children }) => (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{children}</p>
          ),
        },
        list: {
          bullet: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
              {children}
            </ul>
          ),
          number: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
              {children}
            </ol>
          ),
        },
        marks: {
          link: ({ value, children }) => (
            <a
              href={value?.href}
              className="text-primary font-semibold hover:underline"
              rel={value?.href?.startsWith('http') ? 'noreferrer' : undefined}
              target={value?.href?.startsWith('http') ? '_blank' : undefined}
            >
              {children}
            </a>
          ),
        },
      }}
    />
  );
}
