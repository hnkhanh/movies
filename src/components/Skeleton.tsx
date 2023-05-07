import './Skeleton.scss';

const SkeletonLoading = () => {
  return (
    <div className='skeleton-loading'>
      <div className='skeleton-loading__poster'></div>
      <div className='skeleton-loading__title'></div>
      <div className='skeleton-loading__stats'></div>
    </div>
  );
};

export default SkeletonLoading;
