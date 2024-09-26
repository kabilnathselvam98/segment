import React, { useState } from 'react';
import '../Segment/styles.css';
import { API_URL } from '../../API/apiconfig';
function Savesegment() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [schemas, setSchemas] = useState(['']);

  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ];

  const handleSchemaChange = (index, value) => {
    const newSchemas = [...schemas];
    newSchemas[index] = value;
    setSchemas(newSchemas);
  };

  const addNewSchema = () => {
    setSchemas([...schemas, '']);
  };

  const removeSchema = (index) => {
    const newSchemas = schemas.filter((_, i) => i !== index);
    setSchemas(newSchemas);
  };

  const handleSubmit = () => {
    const trimmedSegmentName = segmentName.trim();
    if (trimmedSegmentName === '') {
      alert('Please enter a name for the segment.');
      return;
    }

    const selectedSchemas = schemas.filter(schema => schema !== '');
    if (selectedSchemas.length === 0) {
      alert('Please add at least one schema to the segment.');
      return;
    }

    const schemaData = selectedSchemas.map(schema => ({
      [schema]: schema.charAt(0).toUpperCase() + schema.slice(1).replace('_', ' ')
    }));

    const dataToSend = {
      segment_name: trimmedSegmentName,
      schema: schemaData,
    };

    console.log('Sending data to server:', JSON.stringify(dataToSend));

   
    fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
    .then(response => {
        alert('Segment saved successfully!');
    })
    .catch(error => {
      console.error('Error sending data:', error);
      alert('Error sending data.');
    });
    setSegmentName('');
    setSchemas(['']);
    setIsPopupOpen(false);
  };

  const availableSchemas = schemaOptions.filter(option => !schemas.includes(option.value));

  return (
    <div className='main'>
  <button onClick={() => setIsPopupOpen(true)} className="save-segment-button">
    Save segment
  </button>

    {isPopupOpen && (
      <>
        <div className="overlay show" onClick={() => setIsPopupOpen(false)}></div>
        <div className={`sidebar ${isPopupOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button className="back-button" onClick={() => setIsPopupOpen(false)}>
              &lt; 
            </button>
            Saving Segment
          </div>
          <div className="sidebar-content">
            <label>
              <strong>Enter the name of the Segment</strong>
              <br />
              <input
                type="text"
                className="segment-input"
                placeholder='Name of the segment'
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
              <br />
              <strong className="small-bold-text">
                To save your segment, you need to add the schemas to build the query.
              </strong>
            </label>
            <div className="blue-box">
              <h3>Add schema to segment</h3>
              <div className="schema-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {schemas.map((schema, index) => (
                  <div key={index} className="schema-row">
                    <select
                      className="schema-dropdown"
                      value={schema}
                      onChange={(e) => handleSchemaChange(index, e.target.value)}
                    >
                      <option value="" disabled>Add schema to segment</option>
                      {schemaOptions
                        .filter(option => !schemas.includes(option.value) || option.value === schema)
                        .map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                    <button className="remove-button" onClick={() => removeSchema(index)}>
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                ))}
              </div>
              <br></br>
              <a 
                className={`add-schema-link ${availableSchemas.length === 0 ? 'disabled' : ''}`} 
                onClick={availableSchemas.length > 0 ? addNewSchema : undefined}
                style={{ color: availableSchemas.length === 0 ? '#ccc' : '#2099c6', textDecoration: 'none' }}
              >
                + Add new schema
              </a>
            </div>
            <div className="button-container">
              <button className="save-button" onClick={handleSubmit}>Save the segment</button>
              <button className="cancel-button" onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </>
    )}
  </div>

  );
};
export default Savesegment;
