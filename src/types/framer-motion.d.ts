import { Variants } from 'framer-motion';

declare module 'framer-motion' {
  export interface CustomVariants extends Omit<Variants, 'hidden' | 'visible'> {
    hidden: {
      y?: number;
      opacity: number;
    };
    visible: {
      y?: number;
      opacity: number;
      transition: {
        duration?: number;
        ease?: number[];
        staggerChildren?: number;
        when?: string;
        [key: string]: any; // Allow any other transition properties
      };
    };
  }
}