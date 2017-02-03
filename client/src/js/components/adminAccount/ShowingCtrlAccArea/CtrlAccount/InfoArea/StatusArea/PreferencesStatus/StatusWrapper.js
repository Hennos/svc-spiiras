import React from 'react';

import {user as userFields} from '../../../../../../../constants/user';

import {Element} from './Element/index';

const statusFields = userFields.preferences.fields;
const arrayStatus = [{
  title: "Имя",
  name: statusFields.firstName
}, {
  title: "Фамилия",
  name: statusFields.lastName
}, {
  title: "Отчество",
  name: statusFields.middleName
}, {
  title: "Страна",
  name: statusFields.country
}, {
  title: "Населенный пункт",
  name: statusFields.place
}, {
  title: "Университет",
  name: statusFields.university
}, {
  title: "Школа",
  name: statusFields.school
}, {
  title: "Место работы",
  name: statusFields.workplace
}];

export const StatusWrapper = ({value}) => (
  <div className="info-elements-wrapper fat-elements">
    {arrayStatus.map(entry => <
      Element key={entry.name}
              value={(value) ? value[entry.name] : null}
      {...entry}
    />)}
  </div>
);
