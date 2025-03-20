"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Switch } from "@mui/material";

interface SkillRating {
  id?: number;
  skill: string;
  rating: number;
}

interface Category {
  id: number;
  name: string;
  skills: SkillRating[];
  icon?: string;
  color?: string;
}

// Default icons and colors for categories - will be used if not provided by API
const defaultCategoryStyles = {
  "Cloud Skills": { icon: "🌥", color: "#007bff" },
  "Database": { icon: "💽", color: "#28a745" },
  "Deployment": { icon: "🚀", color: "#9c27b0" },
  "Achievements": { icon: "🏆", color: "#ff9800" },
  "Implementation": { icon: "🚩", color: "#dc3545" },
};

const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff6384", "#36a2eb"];

const App = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [isPercentageMode, setIsPercentageMode] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [pendingChanges, setPendingChanges] = useState<{[key: number]: number}>({});

  // Get all categories and their skills on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories');
      if (response.ok) {
        const data: Category[] = await response.json();
        
        // Enhance categories with icons and colors if not provided by API
        const enhancedData = data.map(category => ({
          ...category,
          icon: category.icon || defaultCategoryStyles[category.name as keyof typeof defaultCategoryStyles]?.icon || "📊",
          color: category.color || defaultCategoryStyles[category.name as keyof typeof defaultCategoryStyles]?.color || "#666666"
        }));
        
        setCategories(enhancedData);
        if (enhancedData.length > 0 && expandedCategory === null) {
          setExpandedCategory(enhancedData[0].id);
        }
      } else {
        setMessage('Failed to load categories');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleRatingChange = (skillId: number, newRating: string) => {
    const rating = parseInt(newRating, 10);
    const maxValue = isPercentageMode ? 100 : 10;
    const minValue = isPercentageMode ? 0 : 1;
    
    if (!isNaN(rating) && rating >= minValue && rating <= maxValue) {
      setPendingChanges({...pendingChanges, [skillId]: rating});
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

  // Get the currently active category
  const selectedCategory = categories.find(cat => cat.id === expandedCategory);

  // Format skills data for pie chart
  const getChartData = (categorySkills: SkillRating[]) => {
    return categorySkills.map(skill => ({
      name: skill.skill,
      value: pendingChanges[skill.id!] !== undefined ? pendingChanges[skill.id!] : skill.rating || 0
    }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      {message && <div style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", marginBottom: "15px", borderRadius: "4px" }}>{message}</div>}
      
      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: "20px" }}>
          <div
            onClick={() => setExpandedCategory(category.id === expandedCategory ? null : category.id)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              cursor: "pointer", 
              padding: "10px", 
              borderBottom: "1px solid #ccc", 
              color: category.color, 
              fontSize: "18px", 
              fontWeight: "bold" 
            }}
          >
            <span>{category.icon} {category.name}</span>
            <span>{expandedCategory === category.id ? "▼" : "▶"}</span>
          </div>
          
          {expandedCategory === category.id && (
            <div style={{ display: "flex", flexDirection: window.innerWidth < 768 ? "column" : "row", marginTop: "10px", paddingLeft: "20px", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ width: window.innerWidth < 768 ? "100%" : "55%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <span>⭐</span>
                  <Switch checked={isPercentageMode} onChange={() => setIsPercentageMode(!isPercentageMode)} />
                  <span>%</span>
                </div>
                
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                  <thead>
                    <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
                      <th style={{ padding: "10px" }}>Skills</th>
                      <th style={{ padding: "10px" }}>{isPercentageMode ? "Percentage (0-100%)" : "Rating (1-10)"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.skills.map((skill) => (
                      <tr key={skill.id}>
                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{skill.skill}</td>
                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc", textAlign: "right" }}>
                        <input
                            type="number"
                            min={isPercentageMode ? 0 : 1}
                            max={isPercentageMode ? 100 : 10}
                            value={pendingChanges[skill.id!] !== undefined ? pendingChanges[skill.id!] : skill.rating || ''}
                            onChange={(e) => handleRatingChange(skill.id!, e.target.value)}
                            style={{ 
                            width: "70px", 
                            backgroundColor: "#f0f8ff", /* Light blue highlight */
                            border: "2px solid #4CAF50", /* Green border for emphasis */
                            borderRadius: "4px",
                            padding: "5px",
                            textAlign: "right"
                            }}
                        />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <button 
                    onClick={handleSaveAll}
                    style={{ 
                      backgroundColor: Object.keys(pendingChanges).length > 0 ? "#4CAF50" : "#ddd",
                      color: Object.keys(pendingChanges).length > 0 ? "white" : "#666",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: Object.keys(pendingChanges).length > 0 ? "pointer" : "not-allowed"
                    }}
                    disabled={Object.keys(pendingChanges).length === 0}
                  >
                    SAVE
                  </button>
                </div>
              </div>
              
              <div style={{ width: window.innerWidth < 768 ? "100%" : "40%", marginTop: window.innerWidth < 768 ? "20px" : "0" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={getChartData(category.skills)} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      label={(entry) => entry.value > 0 ? entry.name : ''}
                    >
                      {category.skills.map((_, index) => (
                        <Cell key={index} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => isPercentageMode ? `${value}%` : `${value}/10`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;