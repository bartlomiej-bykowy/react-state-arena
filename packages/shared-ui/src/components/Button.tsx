type ButtonProps = {
  onClick?: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: React.ReactNode;
};

export function Button({ onClick, children, type = "button" }: ButtonProps) {
  return (
    <button
      className="px-3 py-2 text-xs text-white bg-blue-700 rounded-md transition-colors cursor-pointer hover:bg-blue-800"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
