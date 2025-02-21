import React from 'react';

const Reason = () => {
  return (
    <section className='reason py-5 bg-light' id='features'>
      <div className='container'>
        <h2 className='text-center display-5 fw-bold'>
          Why Choose KultureXplora?
        </h2>
        <div className='text-center mb-5'>
          <div className='section-divider'></div>
        </div>

        <div className='row g-4'>
          {/* <!-- Feature 1 --> */}
          <div className='col-md-6'>
            <div className='card h-100 feature-card border-0 shadow-sm'>
              <div className='card-body text-center p-4'>
                <div className='feature-icon mx-auto'>
                  <i className='bi bi-globe'></i>
                </div>
                <h3 className='fs-5 mb-3'>All Your Options in One Place</h3>
                <p className='card-text'>
                  We gather safari details from multiple tour operators, so you
                  can easily compare prices, itineraries, and reviews without
                  searching multiple websites.
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Feature 2 --> */}
          <div className='col-md-6'>
            <div className='card h-100 feature-card border-0 shadow-sm'>
              <div className='card-body text-center p-4'>
                <div className='feature-icon mx-auto'>
                  <i className='bi bi-star'></i>
                </div>
                <h3 className='fs-5 mb-3'>Reliable Recommendations</h3>
                <p className='card-text'>
                  Tours are sorted based on real traveler feedback, ratings, and
                  popularity, helping you find the best options quickly.
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Feature 3 --> */}
          <div className='col-md-6'>
            <div className='card h-100 feature-card border-0 shadow-sm'>
              <div className='card-body text-center p-4'>
                <div className='feature-icon mx-auto'>
                  <i className='bi bi-chat-square-text'></i>
                </div>
                <h3 className='fs-5 mb-3'>
                  Honest Reviews from Real Travelers
                </h3>
                <p className='card-text'>
                  Read reviews from people who have actually been on the tours,
                  and share your own experience to help others.
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Feature 4 --> */}
          <div className='col-md-6'>
            <div className='card h-100 feature-card border-0 shadow-sm'>
              <div className='card-body text-center p-4'>
                <div className='feature-icon mx-auto'>
                  <i className='bi bi-search'></i>
                </div>
                <h3 className='fs-5 mb-3'>Less Searching, More Exploring</h3>
                <p className='card-text'>
                  We do the research for you, so you can focus on choosing the
                  safari that's right for you without the hassle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reason;
