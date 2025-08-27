import './GoogleAutocompleteInput.scss';

import { Input as AntInput } from "antd";
import type { InputProps, InputRef } from "antd";
import { usePlacesWidget } from "react-google-autocomplete";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FC, ReactNode } from 'react'
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { InputStatus } from "antd/es/_util/statusUtils";

interface GoogleAutocompleteInputProps extends InputProps {
  label: string;
  required?: boolean;
}

const GoogleAutocompleteInput: FC<GoogleAutocompleteInputProps> = ({ label, required, ...props }) => {
  const antInputRef = useRef<InputRef>(null);
  const [isFocused, setIsFocused] = useState(true);

  const { ref: antRef } = usePlacesWidget<HTMLInputElement | null>({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    language: 'en',
    options: {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    },
    onPlaceSelected: (place) => {
      //@ts-ignore
      props.onChange({ target: { value: place.formatted_address } })
    },
  });

  useEffect(() => {
    return () => {
      setIsFocused(true);
      antInputRef.current = null;
    }
  }, []);

  const validationOptions: { status?: InputStatus, prefix?: ReactNode } = useMemo(() => (required ? {
    status: !isFocused && !props.value ? 'error' : undefined,
    prefix: !isFocused && !props.value ? <ExclamationCircleOutlined/> : undefined
  } : {}), [required, isFocused, props.value]);

  return <div className='google_autocomplete_input'>
    <label className='google_autocomplete_input_title'>{label}</label>
    <AntInput {...validationOptions} onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)} ref={(c) => {
      antInputRef.current = c;
      if (c) antRef.current = c.input;
    }} variant='outlined' {...props}/>
  </div>
}

export default GoogleAutocompleteInput;
