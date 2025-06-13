import { Input as AntInput } from "antd";
import type { InputProps } from "antd";
import { usePlacesWidget } from "react-google-autocomplete";
import { FC, useRef } from "react";

interface GoogleAutocompleteInputProps extends InputProps {
  label: string;
}

const GoogleAutocompleteInput: FC<GoogleAutocompleteInputProps> = ({ label, ...props }) => {
  const antInputRef = useRef(null);

  const { ref: antRef } = usePlacesWidget({
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
