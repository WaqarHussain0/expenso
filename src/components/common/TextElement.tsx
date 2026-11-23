import React from 'react';
import clsx from 'clsx';

type TextVariants =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label'
  | 'blockquote'
  | 'small'
  | 'strong'
  | 'em'
  | 'a';

// Default Tailwind utility classes per element
const defaultClasses: Record<TextVariants, string> = {
  h1: 'inter text-2xl md:text-3xl font-semibold text-ink',
  h2: 'text-3xl font-bold',
  h3: 'inter text-ink text-xl font-bold',
  h4: ' inter text-md font-medium ',
  h5: ' text-sm',
  h6: '',
  p: 'text-sm inter text-ink-muted',
  span: 'inter text-sm text-primary hover:underline  cursor-pointer underline',
  label: 'text-[14px] font-[400] text-ink-muted ',
  blockquote: '',
  small: '',
  strong: '',
  em: 's',
  a: 'text-sm text-blue-800 dark:text-blue-300 hover:underline ',
};

interface TextElementProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextVariants;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TextElement: React.FC<TextElementProps> = ({
  as = 'p',
  children,
  className,
  style,
  ...rest
}) => {
  const Component = as;
  const defaultClass = defaultClasses[as] || '';

  return (
    <Component
      className={`${clsx(defaultClass, className)} `}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default TextElement;
