import React from 'react';

const UtilityDemo = () => {
  return (
    <div className="stats-container">
      {/* Section with utility classes */}
      <div className="card card-primary">
        <h2 className="section-header">Dashboard Overview</h2>
        
        <div className="stats-grid">
          <div className="stats-item">
            <span className="stats-value">1,234</span>
            <span className="stats-label">Total Students</span>
          </div>
          <div className="stats-item">
            <span className="stats-value">567</span>
            <span className="stats-label">Active Companies</span>
          </div>
          <div className="stats-item">
            <span className="stats-value">89</span>
            <span className="stats-label">Placements</span>
          </div>
        </div>
      </div>

      {/* Form example with utility classes */}
      <div className="form-container">
        <div className="form-header">
          <h3 className="section-header">Add New Student</h3>
        </div>
        
        <div className="form-group">
          <label className="input-label">Student Name</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Enter student name"
          />
        </div>
        
        <div className="form-group-inline">
          <div className="form-group">
            <label className="input-label">Roll Number</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Roll number"
            />
          </div>
          <div className="form-group">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email address"
            />
          </div>
        </div>
        
        <div className="flex-between gap-md mt-4">
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary">Save Student</button>
        </div>
      </div>

      {/* Filter section example */}
      <div className="filter-container">
        <h4 className="filter-header">Filter Options</h4>
        
        <div className="filter-section">
          <span className="filter-label">Department</span>
          <div className="filter-options">
            <button className="chip chip-active">Computer Science</button>
            <button className="chip">Electrical</button>
            <button className="chip">Mechanical</button>
          </div>
        </div>
        
        <div className="filter-section">
          <span className="filter-label">Year</span>
          <div className="filter-options">
            <button className="chip">2024</button>
            <button className="chip chip-active">2023</button>
            <button className="chip">2022</button>
          </div>
        </div>
      </div>

      {/* Table container example */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Recent Activities</h3>
          <div className="table-actions">
            <button className="btn btn-sm btn-primary">Export</button>
            <button className="btn btn-sm btn-secondary">Filter</button>
          </div>
        </div>
        
        <div className="grid grid-cols-auto gap-md">
          <div className="card hover-lift">
            <h4 className="text-primary font-semibold">Student Registration</h4>
            <p className="text-light">John Doe registered for placement</p>
            <span className="text-sm text-light mt-2">2 hours ago</span>
          </div>
          
          <div className="card hover-lift">
            <h4 className="text-primary font-semibold">Company Visit</h4>
            <p className="text-light">Google scheduled campus interview</p>
            <span className="text-sm text-light mt-2">5 hours ago</span>
          </div>
          
          <div className="card hover-lift">
            <h4 className="text-primary font-semibold">Placement Success</h4>
            <p className="text-light">Jane Smith got placed at Microsoft</p>
            <span className="text-sm text-light mt-2">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityDemo;
