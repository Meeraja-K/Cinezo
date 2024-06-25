import React from "react";
import Abouts from "../assets/hello.jpg";
import "../styles/About.css";
function About() {
  return (
    <div className="about">
      <div
        className="aboutTop"
        style={{ backgroundImage: `url(${Abouts})` }}
      ></div>
      <div className="aboutBottom">
        <h1> ABOUT US</h1>
        <p>
        Welcome to Cinezo, your ultimate streaming destination offering 
        a vast selection of movies, series, and shows. With an extensive 
        collection of <b>2590+ Movies, 1330+ Series, and 990+ Shows</b>, 
        Cinezo ensures there's something for everyone. From the latest 
        blockbuster hits to binge-worthy series and timeless classics, 
        our library spans multiple genres, including action, drama, 
        comedy, thriller, romance, fantasy, horror, and more. Explore 
        over <b>140+ languages</b> and delve into <b>13 basic movie 
        genres</b> such as Action, Crime, Drama, Fantasy, Horror, Comedy, 
        Romance, Science Fiction, Sports, Thriller, Mystery, War, and 
        Western. Additionally, discover over <b>90 movie subgenres</b>, 
        ranging from space travel sci-fi to contemporary westerns.<br />
        Our platform is designed for seamless navigation, allowing you 
        to effortlessly discover and enjoy your favorite films and shows 
        anytime, anywhere. Whether you're watching at home or on the go, 
        Cinezo delivers high-quality streaming to enhance your viewing 
        experience. Join our community of film enthusiasts and immerse 
        yourself in the art of storytelling through film and television. 
        With regular updates and new releases, there's always something 
        new to explore. Start your cinematic journey with Cinezo today!
        </p>
      </div>
    </div>
  );
}

export default About;
