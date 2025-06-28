import { Input as AntInput } from "antd";
import type { InputProps, InputRef } from "antd";
import { usePlacesWidget } from "react-google-autocomplete";
import { useRef } from "react";
import type { FC } from 'react'

interface GoogleAutocompleteInputProps extends InputProps {
  label: string;
}

const GoogleAutocompleteInput: FC<GoogleAutocompleteInputProps> = ({ label, ...props }) => {
  const antInputRef = useRef<InputRef>(null);

  const { ref: antRef } = usePlacesWidget<HTMLInputElement | null>({
    // TODO .env
    apiKey: 'AIzaSyAxHACIMsK8Cvdl0zu4Hj9jHCWNdgJCPu4',
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

  return <div className='google_autocomplete_input'>
    <h6>{label}</h6>
    <AntInput ref={(c) => {
      antInputRef.current = c;
      if (c) antRef.current = c.input;
    }} variant='filled' {...props}/>
  </div>
}

export default GoogleAutocompleteInput;
