import React from "react";
import clsx from "clsx";

type TextVariants =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "label"
  | "blockquote"
  | "small"
  | "strong"
  | "em"
  | "a";

// Default Tailwind utility classes per element
const defaultClasses: Record<TextVariants, string> = {
  h1: "text-3xl font-semibold text-foreground font-heading",
  h2: "text-3xl font-bold font-heading",
  h3: " font-body text-xl font-bold",
  h4: " text-md font-body",
  h5: "font-body text-sm",
  h6: "font-body",
  p: "text-muted-foreground font-body",
  span: "text-[#52545B] font-400] text-[12px] font-body",
  label: "text-[14px] font-[400] text-[#4D4D4D] font-body",
  blockquote: "",
  small: "",
  strong: "",
  em: "s",
  a: "text-sm text-blue-800 hover:underline font-body",
};

interface TextElementProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextVariants;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TextElement: React.FC<TextElementProps> = ({
  as = "p",
  children,
  className,
  style,
  ...rest
}) => {
  const Component = as;
  const defaultClass = defaultClasses[as] || "";

  return (
    <Component
      className={`${clsx(defaultClass, className)}  `}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default TextElement;
