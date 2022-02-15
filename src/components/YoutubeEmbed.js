import React from "react";
import PropTypes from "prop-types";
import useWindowDimensions from "../hooks/useWindowDimensions";

const YoutubeEmbed = ({ embedId }) => {
  const {width, height} = useWindowDimensions()
  return (
    <div className="w-full h-fit">
      <iframe
        width={width*0.6}
        height={(width*0.6)/2}
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
}

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed;