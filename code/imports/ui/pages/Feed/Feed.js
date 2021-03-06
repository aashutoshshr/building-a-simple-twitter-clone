import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Pups from '../../../api/Pups/Pups';
import PupComposer from '../../components/PupComposer/PupComposer';
import PupsList from '../../components/Pups/Pups';
import Loading from '../../components/Loading/Loading';

import './Feed.scss';

class Feed extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        const currentLimit = this.props.requestedPups.get();
        if (currentLimit < this.props.totalPups) this.props.requestedPups.set(currentLimit + 25);
      }
    });
  }

  render() {
    const { loading, pups } = this.props;
    return (
      <div className="Feed">
        <PupComposer />
        <PupsList pups={pups} />
        {loading ? <Loading /> : ''}
      </div>
    );
  }
}

Feed.defaultProps = {
  pups: [],
};

Feed.propTypes = {
  loading: PropTypes.bool.isRequired,
  pups: PropTypes.array,
  requestedPups: PropTypes.object.isRequired,
  totalPups: PropTypes.number.isRequired,
};

const requestedPups = new ReactiveVar(25);

export default createContainer(() => {
  const subscription = Meteor.subscribe('pups.feed', requestedPups.get());

  return {
    loading: !subscription.ready(),
    requestedPups,
    totalPups: Counts.get('Pups.feed'),
    pups: Pups.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, Feed);
