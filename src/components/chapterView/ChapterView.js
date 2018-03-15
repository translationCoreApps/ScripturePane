/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-find-dom-node */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
// components
import BibleHeadingsRow from './BibleHeadingsRow';
import VerseRow from './VerseRow';
import VerseEditorDialog from '../VerseEditorDialog';

class ChapterView extends React.Component {

  constructor(props) {
    super(props);
    this.handleEditTargetVerse = this.handleEditTargetVerse.bind(this);
    this.handleEditorCancel = this.handleEditorCancel.bind(this);
    this.handleEditorSubmit = this.handleEditorSubmit.bind(this);
    this.state = {
      editVerse: null
    };
  }

  componentDidMount() {
    let {chapter, verse} = this.props.contextIdReducer.contextId.reference;
    let verseReference = ChapterView.makeRefKey(chapter, verse);
    let currentVerse = this.verseRefs[verseReference];
    let element = ReactDOM.findDOMNode(currentVerse);
    if (element) element.scrollIntoView();
  }

  /**
   * Generates a key to use for verse ref's
   * @param chapter
   * @param verse
   * @return {string}
   */
  static makeRefKey(chapter, verse) {
    return `c${chapter.toString()}v${verse.toString()}`;
  }

  /**
   * Handles events to edit the target verse
   * @param bibleId
   * @param chapter
   * @param verse
   * @param verseText
   */
  handleEditTargetVerse(bibleId, chapter, verse, verseText) {
    console.log('editing verse!');
    this.setState({
      editVerse: {
        bibleId,
        chapter,
        verse,
        verseText
      }
    });
  }

  handleEditorSubmit() {
    // TODO: save
    this.setState({
      editVerse: null
    });
  }

  handleEditorCancel() {
    this.setState({
      editVerse: null
    });
  }

  render() {
    const {translate, resourcesReducer, contextIdReducer, actions, selectionsReducer, settingsReducer, showModal, projectDetailsReducer} = this.props;
    let {bibles} = this.props.resourcesReducer;
    let {chapter} = this.props.contextIdReducer.contextId.reference;
    let verseNumbers = Object.keys(bibles['en']['ulb'][chapter]);

    this.verseRefs = {};

    // for verses in chapter
    let verseRows = <div/>;
    if (verseNumbers.length > 0) {
      verseRows = verseNumbers.map(verseNumber => {
        const refKey = ChapterView.makeRefKey(chapter, verseNumber);
        return (
          <VerseRow key={verseNumber}
                    verseNumber={verseNumber}
                    onEditTargetVerse={this.handleEditTargetVerse}
                    actions={actions}
                    selectionsReducer={selectionsReducer}
                    settingsReducer={settingsReducer}
                    resourcesReducer={resourcesReducer}
                    contextIdReducer={contextIdReducer}
                    projectDetailsReducer={projectDetailsReducer}
                    ref={node => this.verseRefs[refKey] = node} />
        );
      });
    }

    const {editVerse} = this.state;
    const openEditor = editVerse !== null;
    let verseTitle;
    let verseText;
    if(editVerse) {
      verseTitle = ` ${editVerse.chapter}:${editVerse.verse}`;
      console.log(bibles[editVerse.bibleId]);
    }

    return (
      <div>
        <div style={{width: '100%', height: '100%'}}>
          <BibleHeadingsRow settingsReducer={settingsReducer}
                            resourcesReducer={resourcesReducer}
                            projectDetailsReducer={projectDetailsReducer}
                            showModal={showModal} />
          <div style={{overflowY: 'scroll', overflowX: 'hidden', height: '430px'}}>
            {verseRows}
          </div>
        </div>
        <VerseEditorDialog translate={translate}
                           onSubmit={this.handleEditorSubmit}
                           open={openEditor}
                           onCancel={this.handleEditorCancel}
                           verseText={verseText}
                           verseTitle={verseTitle}/>
      </div>

    );
  }
}

ChapterView.propTypes = {
  translate: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  selectionsReducer: PropTypes.object.isRequired,
  settingsReducer: PropTypes.object.isRequired,
  contextIdReducer: PropTypes.object.isRequired,
  resourcesReducer: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
  projectDetailsReducer: PropTypes.object.isRequired
};

export default ChapterView;
