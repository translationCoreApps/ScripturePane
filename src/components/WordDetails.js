import React from 'react';
import PropTypes from 'prop-types';
// helpers
import * as lexiconHelpers from '../helpers/lexiconHelpers';

class WordDetails extends React.Component {

  render() {
    const {lemma, morph, strong} = this.props.word;
    const { translate, lexiconData } = this.props;
    const entryId = lexiconHelpers.lexiconEntryIdFromStrongs(strong);
    const lexiconId = lexiconHelpers.lexiconIdFromStrongs(strong);
    let lexicon;
    if (lexiconData[lexiconId] && lexiconData[lexiconId][entryId]) {
      lexicon = lexiconData[lexiconId][entryId].long;
    }
    return (
      <div style={{margin: '-10px 10px -20px', maxWidth: '400px'}}>
        <span><strong>{translate("lemma")}</strong> {lemma}</span><br/>
        <span><strong>{translate("morphology")}</strong> {morph}</span><br/>
        <span><strong>{translate("strongs")}</strong> {strong}</span><br/>
        <span><strong>{translate("lexicon")}</strong> {lexicon}</span><br/>
      </div>
    );
  }
}

WordDetails.propTypes = {
  translate: PropTypes.func.isRequired,
  word: PropTypes.object.isRequired,
  lexiconData: PropTypes.object.isRequired
};

export default WordDetails;
