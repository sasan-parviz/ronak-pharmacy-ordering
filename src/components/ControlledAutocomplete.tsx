import { Autocomplete, AutocompleteProps } from "@mui/material";
import { Controller } from "react-hook-form";

export const ControlledAutocomplete = ({
  options = [],
  renderInput,
  getOptionLabel,
  onChange: ignored,
  control,
  defaultValue,
  name,
  renderOption,
  autoCompleteProps,
}: {
  options: any[];
  renderInput: (params: any) => JSX.Element;
  getOptionLabel: (option: any) => string;
  onChange?: (event: any, value: any) => void;
  control: any;
  defaultValue: any;
  name: string;
  renderOption?: (option: any) => JSX.Element;
  autoCompleteProps?: Omit<AutocompleteProps<any, any, any, any>, "options" | "renderInput">;
}) => {
  return (
    <Controller
      render={({ field: { onChange, ...props } }) => (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={renderInput}
          onChange={(e: any, data: any) => onChange(data)}
          {...autoCompleteProps}
          {...props}
        />
      )}
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  );
};
