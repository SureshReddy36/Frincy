// import React, { ReactNode } from 'react';

// interface CardProps {
//   children: ReactNode;
//   className?: string;
//   padding?: 'sm' | 'md' | 'lg';
//   hover?: boolean;
// }

// const Card: React.FC<CardProps> = ({ 
//   children, 
//   className = '', 
//   padding = 'md',
//   hover = false 
// }) => {
//   const paddingClasses = {
//     sm: 'p-4',
//     md: 'p-6',
//     lg: 'p-8'
//   };

//   return (
//     <div className={`
//       bg-white rounded-xl shadow-sm border border-gray-200
//       ${hover ? 'hover:shadow-lg hover:border-gray-300 transition-all duration-200' : ''}
//       ${paddingClasses[padding]}
//       ${className}
//     `}>
//       {children}
//     </div>
//   );
// };

// export default Card;

import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
      ${hover ? 'hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200' : ''}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;