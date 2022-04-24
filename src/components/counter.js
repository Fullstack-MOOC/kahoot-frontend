import React from 'react';
import { connect } from 'react-redux';

// this can be dumb or smart component - connect works with either
function Counter(props) {
  return (
    <div>
      Current Count: {props.count}
    </div>
  );
}

// connects particular parts of redux state to this components props
const mapStateToProps = (state) => (
  {
    count: state.count,
  }
);

// react-redux glue -- outputs Container that know state in props
export default connect(mapStateToProps, null)(Counter);
