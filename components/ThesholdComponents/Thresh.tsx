'use client'

import React, { useState, useEffect } from 'react';
import styles from './Thresh.module.css';

interface SkillRating {
  id?: number;
  skill: string;
  rating: number;
}

interface Category {
  id: number;
  name: string;
  skills: SkillRating[];
}

const SkillsApp: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [pendingChanges, setPendingChanges] = useState<{[key: number]: number}>({});

  // Get all categories and their skills on component mount
  useEffect(() => {
    fetchCategories();
  }, []);


  const handleSubmit = async (skillId: number) => {
    if (pendingChanges[skillId] !== undefined) {
      try {
        const response = await fetch(`http://localhost:8000/skills/${skillId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating: pendingChanges[skillId] }),
        });
        
        if (response.ok) {
          setMessage('Rating updated successfully');
          fetchCategories(); // Refresh data
          // Clear this pending change
          const newPendingChanges = {...pendingChanges};
          delete newPendingChanges[skillId];
          setPendingChanges(newPendingChanges);
        } else {
          setMessage('Failed to update rating');
        }
      } catch (error) {
        setMessage('Error connecting to server');
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } else {
        setMessage('Failed to load categories');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  // Update rating for a skill
  const updateSkillRating = async (skillId: number, rating: number) => {
    try {
      const response = await fetch(`http://localhost:8000/skills/${skillId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      
      if (response.ok) {
        setMessage('Rating updated successfully');
        fetchCategories(); // Refresh data
      } else {
        setMessage('Failed to update rating');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleSaveAll = async () => {
    const skillIds = Object.keys(pendingChanges);
    if (skillIds.length === 0) return;
    
    let successCount = 0;
    
    for (const skillId of skillIds) {
      try {
        const response = await fetch(`http://localhost:8000/skills/${skillId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating: pendingChanges[Number(skillId)] }),
        });
        
        if (response.ok) {
          successCount++;
        }
      } catch (error) {
        console.error('Error updating skill:', error);
      }
    }
    
    if (successCount === skillIds.length) {
      setMessage('All ratings updated successfully');
    } else if (successCount > 0) {
      setMessage(`Updated ${successCount} out of ${skillIds.length} ratings`);
    } else {
      setMessage('Failed to update ratings');
    }
    
    // Refresh data and clear pending changes
    fetchCategories();
    setPendingChanges({});
  };

  const handleRatingChange = (skillId: number, newRating: string) => {
  const rating = parseInt(newRating, 10);
  if (!isNaN(rating) && rating >= 0 && rating <= 10) {
    setPendingChanges({...pendingChanges, [skillId]: rating});
  }
};

  // Get skills for the selected category
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Skills Assessment</h1>
      
      {/* Category selector */}
      <div className={styles.categoryContainer}>
        {categories.map(category => (
          <button 
            key={category.id} 
            onClick={() => setSelectedCategory(category.id)}
            className={`${styles.categoryButton} ${category.id === selectedCategory ? styles.categoryButtonActive : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {message && <div className={styles.message}>{message}</div>}
      
      {/* Rating Mode toggle */}
      <div className={styles.modeToggle}>
        <span>⭐</span>
        <span>Rating Mode (0-10)</span>
      </div>
      {/* Skills list with rating inputs */}
      {/* Skills list with rating inputs */}
{selectedCategoryData && selectedCategoryData.skills && (
  <div className={styles.skillsContainer}>
    <h2 className={styles.skillsHeader}>{selectedCategoryData.name} Skills</h2>
    {selectedCategoryData.skills.map(skill => (
      <div key={skill.id} className={styles.skillItem}>
        <div className={styles.skillName}>{skill.skill}</div>
        <div>
          <input
            type="number"
            min="0"
            max="10"
            value={pendingChanges[skill.id!] !== undefined ? pendingChanges[skill.id!] : skill.rating || ''}
            onChange={(e) => handleRatingChange(skill.id!, e.target.value)}
            className={styles.ratingInput}
          />
        </div>
      </div>
    ))}
    <div className={styles.saveButtonContainer}>
      <button 
        onClick={handleSaveAll}
        className={styles.saveButton}
        disabled={Object.keys(pendingChanges).length === 0}
      >
        SAVE
      </button>
    </div>
  </div>
            )}
    </div>
  );
};

export default SkillsApp;
