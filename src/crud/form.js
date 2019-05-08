import {arrayOf, func, object, shape, string} from 'prop-types';
import React, {useState} from 'react';

import './crud.scss';

function Form({cancel, fields, item, save}) {
  const [newItem, setNewItem] = useState(item);

  function getInput(field, index) {
    const {max, min, placeholder, propertyName, type} = field;
    const value = newItem[propertyName] || '';

    if (type === 'radio') {
      return field.options.map(option => (
        <div className="radio" key={`${propertyName}-${option}`}>
          <input
            checked={value === option}
            name={propertyName}
            onChange={e => onChange(e, propertyName)}
            type="radio"
            value={option}
          />
          <label>{option}</label>
        </div>
      ));
    }

    if (type === 'select') {
      return (
        <select onChange={e => onChange(e, propertyName)} value={value}>
          {field.options.map(option => (
            <option key={`${propertyName}-${option}`} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    const inputProps = {
      autoFocus: index === 0,
      onChange: e => onChange(e, propertyName),
      placeholder,
      type,
      value
    };

    if (type === 'range') {
      if (max !== undefined) inputProps.max = max;
      if (min !== undefined) inputProps.min = min;
      if (!value) inputProps.value = 0;
      return (
        <div className="range">
          <input {...inputProps} />
          {inputProps.value}
        </div>
      );
    }

    if (type === 'checkbox') inputProps.checked = value;

    return <input {...inputProps} />;
  }

  function onChange(event, propertyName) {
    const {checked, type, value} = event.target;
    const valueToUse = type === 'checkbox' ? checked : value;
    setNewItem(newItem => ({...newItem, [propertyName]: valueToUse}));
  }

  function onCancel(event) {
    event.preventDefault();
    cancel();
  }

  function onSave(event) {
    event.preventDefault();
    save(newItem);
  }

  function renderRow(field, index) {
    return (
      <div className="row" key={field.propertyName}>
        <label>{field.label}</label>
        <div className="input">{getInput(field, index)}</div>
      </div>
    );
  }

  const haveAllRequired = fields.every(
    field => !field.required || Boolean(newItem[field.propertyName])
  );

  return (
    <form>
      {fields.map(renderRow)}
      <div className="buttons">
        <button disabled={!haveAllRequired} onClick={onSave}>
          {item ? 'Save' : 'Add'}
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

Form.propTypes = {
  cancel: func.isRequired,
  fields: arrayOf(
    shape({
      className: string,
      label: string.isRequired,
      placeholder: string,
      propertyName: string.isRequired,
      type: string.isRequired
    })
  ),
  item: object,
  save: func.isRequired
};

export default Form;
