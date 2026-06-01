import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from './LoadingSkeleton';

export default function LazySection({ children }) {
  return <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>;
}

LazySection.propTypes = {
  children: PropTypes.node.isRequired,
};
