export function loadScript(src, position, id) {
    if (!position) {
      return;
    }
  
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
    console.log('loaded maps')
}

export function loadGoogleMapsScript() {
    if (typeof window !== 'undefined') {
        if (!document.querySelector('#google-maps')) {
          loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`,
            document.querySelector('head'),
            'google-maps',
          );
        }
    }
}