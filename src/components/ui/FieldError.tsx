// Inline accessible error message for a single form field.
// Pair with `aria-invalid` and `aria-describedby={id}` on the input.
interface Props {
  id: string;
  message?: string | null;
}

export const FieldError = ({ id, message }: Props) => {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-xs font-sans text-[hsl(var(--destructive,0_70%_45%))] text-red-700"
    >
      {message}
    </p>
  );
};
