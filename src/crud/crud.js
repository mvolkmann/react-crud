import {arrayOf, func, shape, string} from 'prop-types';
import React, {useState, useRef} from 'react';
import Form from './form';

import './crud.scss';

function Crud({options}) {
  const [mode, setMode] = useState('retrieve');
  const [selectedItems, setSelectedItems] = useState([]);
  const itemMap = useRef({});

  function deleteSelected() {
    const ids = selectedItems.map(item => item.id);
    options.deleteItems(ids);
    for (const id of ids) {
      delete itemMap.current[id];
    }
    setSelectedItems([]);
  }

  function formView() {
    const {createItem, formFields, updateItem} = options;
    const isUpdate = mode === 'update';

    function cancel() {
      setMode('retrieve');
    }

    function save(item) {
      const fn = isUpdate ? updateItem : createItem;
      fn(item);
      setMode('retrieve');
      setSelectedItems([]);
    }

    const item = isUpdate ? selectedItems[0] : {};
    return <Form fields={formFields} item={item} cancel={cancel} save={save} />;
  }

  function listView() {
    const {
      compareItems,
      createItem,
      deleteItems,
      itemToString,
      retrieveItems,
      updateItem
    } = options;

    itemMap.current = retrieveItems();
    const items = Object.values(itemMap.current).sort(compareItems);

    return (
      <>
        <select multiple onChange={onSelect}>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {itemToString(item)}
            </option>
          ))}
        </select>
        <div className="buttons">
          {createItem && (
            <button onClick={() => setMode('create')}>
              <span aria-label="plus" role="img">
                &#x2795;
              </span>
            </button>
          )}
          {updateItem && (
            <button
              disabled={selectedItems.length === 0}
              onClick={() => setMode('update')}
            >
              <span aria-label="pencil" role="img">
                &#x270E;
              </span>
            </button>
          )}
          {deleteItems && (
            <button
              disabled={selectedItems.length === 0}
              onClick={deleteSelected}
            >
              <span aria-label="trashcan" role="img">
                &#x1f5d1;
              </span>
            </button>
          )}
        </div>
      </>
    );
  }

  function onSelect(event) {
    const {selectedOptions} = event.target;
    const newSelectedItems = Array.from(selectedOptions).map(
      option => itemMap.current[option.value]
    );
    setSelectedItems(newSelectedItems);
  }

  return (
    <div className="crud">{mode === 'retrieve' ? listView() : formView()}</div>
  );
}

Crud.propTypes = {
  options: shape({
    compareItems: func.isRequired, // passed two item objects
    createItem: func, // passed an item object
    deleteItems: func, // passed array of ids
    formFields: arrayOf(
      shape({
        className: string,
        label: string.isRequired,
        placeholder: string,
        propertyName: string.isRequired,
        type: string.isRequired
      })
    ),
    //ItemForm: func, // passed optional item object and a save function
    itemToString: func.isRequired, // passed an item object; returns a string
    retrieveItems: func.isRequired, //TODO: Add pagination support.
    updateItem: func // passed an item object
  })
};

export default Crud;
