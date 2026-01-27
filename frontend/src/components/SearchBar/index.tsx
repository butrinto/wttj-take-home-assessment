import { InputText } from "welcome-ui/InputText";
import { Field } from "welcome-ui/Field";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) => {
  return (
    <Field label="" className="mb-md">
      <InputText
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
};
