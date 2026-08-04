import { Link } from 'react-router-dom';
import { STORY_IMG } from '../utils/images';

export default function OurStory({ buttonTo = '/about', buttonLabel = 'Discover More', showOnAbout = false }) {
  return (
    <section className="section story-section">
      <div className="container">
        <div className="story-wrap">
          {!showOnAbout && (
            <div className="story-frame">
              <div className="story-img">
                <img src={STORY_IMG} alt="Barista at work" loading="lazy" />
              </div>
            </div>
          )}
          {!showOnAbout && (
            <div className="story-divider-col" aria-hidden="true">
              <span className="diamond" />
              <span className="divider-line" />
              <span className="diamond" />
            </div>
          )}
          <div className="story-content">
            <p className="story-eyebrow">Hey! Welcome to Patio Time Cafe</p>
            <h2>Our Story</h2>
            <p>
              Food is the foundation of true happiness. Lorem ipsum dolor sit amet, consectetuer adipiscing elit aenean commodo.
            </p>
            <p>
              We see our customers as invited guests to a party, and we are the hosts. It&apos;s our job every day to make every important aspect of the customer experience a little bit better. Donec quam felis, ultricies nec, pellentesque eu.
            </p>
            <Link to={buttonTo} className="btn btn-solid">{buttonLabel}</Link>
          </div>
          {showOnAbout && (
            <div className="story-frame story-frame-right">
              <div className="story-img story-img-curved">
                <img src={STORY_IMG} alt="Coffee brewing" loading="lazy" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
