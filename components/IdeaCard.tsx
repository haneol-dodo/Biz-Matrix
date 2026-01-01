import React from 'react';
import { Idea } from '../types';

/** 
 * Note: This component is currently deprecated in favor of direct table rendering 
 * to maintain a professional report style. 
 */
interface IdeaCardProps {
  idea: Idea;
  type: 'survival' | 'entrepreneur' | 'expert';
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, type }) => {
  return null;
};
