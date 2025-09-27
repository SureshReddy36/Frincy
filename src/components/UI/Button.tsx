// import React, { ReactNode, ButtonHTMLAttributes } from 'react';
// import { Loader2 } from 'lucide-react';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   children: ReactNode;
//   variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
//   size?: 'sm' | 'md' | 'lg';
//   loading?: boolean;
//   icon?: ReactNode;
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = 'primary',
//   size = 'md',
//   loading = false,
//   icon,
//   className = '',
//   disabled,
//   ...props
// }) => {
//   const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
//   const variantClasses = {
//     primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-sm',
//     secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
//     success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-500 shadow-sm',
//     danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-sm',
//     outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
//   };

//   const sizeClasses = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base'
//   };

//   return (
//     <button
//       className={`
//         ${baseClasses}
//         ${variantClasses[variant]}
//         ${sizeClasses[size]}
//         ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
//         ${className}
//       `}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//       {!loading && icon && <span className="mr-2">{icon}</span>}
//       {children}
//     </button>
//   );
// };

// export default Button;

// below is working
// import React, { ReactNode, ButtonHTMLAttributes } from 'react';
// import { Loader2 } from 'lucide-react';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   children: ReactNode;
//   variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
//   size?: 'sm' | 'md' | 'lg';
//   loading?: boolean;
//   icon?: ReactNode;
//   as?: 'button' | 'span';
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = 'primary',
//   size = 'md',
//   loading = false,
//   icon,
//   className = '',
//   disabled,
//   as = 'button',
//   ...props
// }) => {
//   const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
//   const variantClasses = {
//     primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-sm',
//     secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
//     success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-500 shadow-sm',
//     danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-sm',
//     outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
//   };

//   const sizeClasses = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base'
//   };

//   const combinedClassName = `
//     ${baseClasses}
//     ${variantClasses[variant]}
//     ${sizeClasses[size]}
//     ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
//     ${className}
//   `;

//   const content = (
//     <>
//       {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//       {!loading && icon && <span className="mr-2">{icon}</span>}
//       {children}
//     </>
//   );

//   if (as === 'span') {
//     return (
//       <span className={combinedClassName} {...(props as any)}>
//         {content}
//       </span>
//     );
//   }

//   return (
//     <button
//       className={combinedClassName}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {content}
//     </button>
//   );
// };

// export default Button;
import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  as?: 'button' | 'span';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  as = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-sm dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-500 shadow-sm',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-sm',
    outline: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const combinedClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (as === 'span') {
    return (
      <span className={combinedClassName} {...(props as any)}>
        {content}
      </span>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;