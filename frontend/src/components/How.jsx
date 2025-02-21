import React from 'react';
import { FaGlobeAmericas } from 'react-icons/fa'; // Font Awesome 圖標
import { AiFillStar } from 'react-icons/ai'; // Ant Design 圖標
import { BsCheckCircleFill } from 'react-icons/bs'; // Bootstrap 圖標

const ProcessCard = ({ number, title, description, icon: Icon }) => {
  return (
    <div className='process-card d-flex flex-column align-items-center p-4 p-sm-6 pt-12 bg-white position-relative mt-8'>
      {/* 數字背景 */}
      <div
        className='process-number position-absolute'
        style={{
          backgroundColor: '#B6DDD0',
        }}
      >
        {number}
      </div>

      <div className='d-flex flex-column align-items-center mt-3 '>
        <h3 className='fs-5 fs-sm-4 fw-semibold text-center mb-2 mb-sm-3'>
          {title}
        </h3>
        {/* 圖標背景 */}
        <div
          className='process-icon mb-3'
          style={{
            backgroundColor: 'rgba(15, 148, 118, 0.1)',
          }}
        >
          {/* 圖標顏色 */}
          <Icon className='icon' style={{ color: '#0F9476' }} />
        </div>
        <p className='text-muted text-center small px-2 px-sm-4'>
          {description}
        </p>
      </div>
    </div>
  );
};

const How = () => {
  const processSteps = [
    {
      id: 1,
      number: '1',
      title: 'Tell Us Your Preferences',
      description: 'Choose country, budget, and style',
      icon: FaGlobeAmericas,
    },
    {
      id: 2,
      number: '2',
      title: 'See Curated Rankings',
      description: 'Only top-rated operators',
      icon: AiFillStar,
    },
    {
      id: 3,
      number: '3',
      title: 'Book with Confidence',
      description: 'Direct access to providers',
      icon: BsCheckCircleFill,
    },
  ];
  return (
    <>
      <section className='how-section py-5'>
        <div className='container'>
          <h2 className='text-center display-5 fw-bold mb-4'>How It Works</h2>
          <h3 className='text-center text-muted mb-5'>
            Too many safari operators to choose from? <br />
            Let us do the work. You see only the best.
          </h3>
          <div className='row g-4 mt-3'>
            {processSteps.map((step) => (
              <div key={step.id} className='col-12 col-md-4'>
                <ProcessCard
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              </div>
            ))}
          </div>

          {/* 導航點也改為相同顏色 */}
          <div className='d-flex justify-content-center d-sm-none gap-2'>
            {processSteps.map((step) => (
              <div
                key={step.id}
                className='nav-dot'
                style={{ backgroundColor: '#0F9476' }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default How;
