import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  testId?: string;
  children: ReactNode;
};

export function Button({
  onClick,
  children,
  type = "button",
  testId
}: ButtonProps) {
  return (
    <button
      className="px-3 py-2 text-xs text-white bg-blue-700 rounded-md transition-colors cursor-pointer hover:bg-blue-800"
      onClick={onClick}
      type={type}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
