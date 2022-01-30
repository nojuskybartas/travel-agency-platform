import { Field, useField } from 'formik';
import { useEffect, useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
  } from 'react-places-autocomplete';

// const GOOGLE_PLACES_API_KEY = 'AIzaSyDAmEmIsmK9SdQkx-6_0fvo-BQCCA9J2To'
// const script = document.createElement("script");
// script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
// script.async = true;
// script.id = 'GooglePlacesApi'
// document.body.appendChild(script);

const GooglePlacesInput = (props) => {
  const [field, meta, helpers] = useField(props)
  const [state, setState] = useState({address: ''})

  const handleChange = address => {
    setState({ address });

    // helpers.setValue()
  };
 
  const handleSelect = address => {
    setState({address: address})
    helpers.setValue([...field.value, address])
    // geocodeByAddress(address)
    //   .then(results => getLatLng(results[0]))
    //   .then(latLng => console.log('Success', latLng))
    //   .catch(error => console.error('Error', error));
  };

  useEffect(() => {
    console.log(state)
  }, [state])
    
    return (
      <PlacesAutocomplete
        value={state.address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className='w-full h-10 flex items-center border-b-2 border-solid border-gray-800 relative transition-long'>
            <Field
              name={field.name}
              {...getInputProps({
                placeholder: props.label || 'Location',
                className: 'w-full h-full px-6 outline-none ',
              })}
            />
            <p className='text-xs text-red-400 italic'>{meta.error ? meta.error : null}</p>
            <div className="autocomplete-dropdown-container w-full h-fit absolute bottom-0 transition-long px-6 text-left bg-gray-400 z-10 inputBarSuggestions_shadow rounded-b-xl translate-y-full">
              {loading && <div className='italic'>Loading...</div>}
              {suggestions.map((suggestion, i) => {
                const className = suggestion.active
                  ? 'suggestion-item--active bg-gray-400 w-full h-full cursor-pointer'
                  : 'suggestion-item bg-inherit z-10';
                // inline style for demonstration purpose
                // const style = suggestion.active
                //   ? { backgroundColor: '#000000', cursor: 'pointer' }
                //   : { backgroundColor: '', cursor: 'pointer' };
                return (
                  <div key={i}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      // style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      // </Field>
    )
}

export default GooglePlacesInput