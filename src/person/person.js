const people = {
  1: {id: 1, firstName: 'Tami', lastName: 'Volkmann', age: 57},
  2: {id: 2, firstName: 'Doug', lastName: 'Morgan'},
  3: {
    id: 3,
    firstName: 'Mark',
    lastName: 'Volkmann',
    age: 58,
    happy: true,
    percent: 10
  }
};
let lastId = 3;

function comparePeople(person1, person2) {
  let compare = person1.lastName.localeCompare(person2.lastName);
  if (compare === 0)
    compare = person1.firstName.localeCompare(person2.firstName);
  return compare;
}

function createPerson(person) {
  lastId++;
  person.id = lastId;
  people[lastId] = person;
}

function deletePeople(ids) {
  for (const id of ids) {
    delete people[id];
  }
}

const personFields = [
  {
    label: 'First Name',
    placeholder: 'not nickname',
    propertyName: 'firstName',
    required: true,
    type: 'text'
  },
  {
    label: 'Last Name',
    propertyName: 'lastName',
    required: true,
    type: 'text'
  },
  {
    label: 'Age',
    propertyName: 'age',
    type: 'number'
  },
  {
    label: 'Happy',
    propertyName: 'happy',
    type: 'checkbox'
  },
  {
    label: 'Color',
    propertyName: 'color',
    type: 'radio',
    options: ['red', 'green', 'blue']
  },
  {
    label: 'Season',
    propertyName: 'season',
    type: 'select',
    options: ['Spring', 'Summer', 'Fall', 'Winter']
  },
  {
    label: 'Percent',
    propertyName: 'percent',
    type: 'range',
    min: 0,
    max: 100
  }
];

function personToString(person) {
  return person.firstName + ' ' + person.lastName;
}

function retrievePeople() {
  return people;
}

function updatePerson(person) {
  if (!people[person.id]) {
    throw new Error(`no person with id ${person.id} exists.`);
  }
  people[person.id] = person;
}

const crudOptions = {
  compareItems: comparePeople,
  createItem: createPerson,
  deleteItems: deletePeople,
  formFields: personFields,
  itemToString: personToString,
  retrieveItems: retrievePeople,
  updateItem: updatePerson
};

export default crudOptions;
