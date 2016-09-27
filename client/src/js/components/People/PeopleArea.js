import React from 'react'

import Man from './Man/index'

class PeopleArea extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {people, title, alt, type} = this.props;
    return (
      <div className="module_wrapper">
        <div className="info_block">
          <p>{(people.length > 0) ? title : alt}</p>
        </div>
        {people.map(man => (
          <Man
            key={man.username}
            type={type}
            {...man}
          />
        ))}
      </div>
    );
  }
}

export default PeopleArea;
