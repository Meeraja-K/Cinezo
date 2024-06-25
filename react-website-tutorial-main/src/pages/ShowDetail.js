import Star from "@material-ui/icons/Star";
import StarHalf from "@material-ui/icons/StarHalf";
import StarBorder from "@material-ui/icons/StarBorder";
import React, { useRef, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BrowseList } from "../helpers/BrowseList";
import "../styles/ShowDetail.css"; // Import the CSS file

function ShowDetail() {
  const { name } = useParams();
  const history = useHistory();
  const videoRef = useRef(null);

  const show = BrowseList.find(
    (item) => item.name.toLowerCase().replace(/ /g, "-") === name
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.style.display = "none"; // Hide the video element
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!show) {
    return <h2>Show not found</h2>;
  }

  // Function to render star icons based on rating out of 5
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full star icons
    for (let i = 0; i < fullStars && i < 5; i++) {
      stars.push(<Star key={i} />);
    }

    // Add half star icon if needed
    if (hasHalfStar && stars.length < 5) {
      stars.push(<StarHalf key={stars.length} />);
    }

    // Fill remaining with StarBorder icons
    while (stars.length < 5) {
      stars.push(<StarBorder key={stars.length} />);
    }

    return stars;
  };

  const handleWatchNow = () => {
    if (videoRef.current) {
      videoRef.current.style.display = "block"; // Ensure the video element is displayed
      videoRef.current.requestFullscreen().then(() => {
        videoRef.current.play();
      }).catch((error) => {
        console.error("Failed to enter fullscreen mode:", error);
      });
    }
  };

  return (
    <div className="show-detail">
      <h1>{show.name}</h1>
      <div className="rating">
        <p className="stars">{renderStars(show.rating)}</p>
      </div>
      <div className="content">
        <div className="description">
          <p>{show.description}</p>
          <button className="watch-now" onClick={handleWatchNow}>
            Watch Now
          </button>
        </div>
        <div className="thumbnail">
          <img src={show.image} alt={show.name} />
          <video ref={videoRef} controls style={{ display: 'none' }}>
            <source src={show.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <button onClick={() => history.push("/browse")}>Back to Browse</button>
    </div>
  );
}

export default ShowDetail;
