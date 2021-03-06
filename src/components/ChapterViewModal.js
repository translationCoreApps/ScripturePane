/**
 * This component displays a modal when the user clicks
 * the button to add resources on the scripture pane module.
 */
import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import BaseDialog from './BaseDialog';
import IconButton from 'material-ui/IconButton';

// components
import ChapterView from './chapterView/ChapterView';

const styles = {
  icon: {
    color: '#ffffff',
    width: 25,
    height: 25
  },
  iconButton: {
    padding: 0,
    width: 25,
    height: 25,
    marginTop: 5
  },
  title: {
    display: 'flex',
    flexDirection: 'row'
  },
  body: {
    padding: 0,
    maxHeight: '500px'
  },
  content: {
    borderBottom: 'solid 1px var(--border-color)'
  }
};


class ChapterViewModal extends React.Component {

  /**
   * Generates the title of the dialog
   * @param {object} manifest
   */
  static makeTitle(manifest) {
    const {target_language, project} = manifest;
    if(target_language && target_language.book && target_language.book.name) {
      return target_language.book.name;
    } else {
      return project.name;
    }
  }

  render() {
    const {
      translate,
      onHide,
      show,
      actions,
      selectionsReducer,
      showModal,
      scripturePane,
      projectDetailsReducer,
      contextIdReducer,
      resourcesReducer
    } = this.props;
    const titleText =ChapterViewModal.makeTitle(projectDetailsReducer.manifest);

    const title = (
      <h4>
        <span style={{flexGrow: 1, textAlign: 'center'}}>{titleText}</span>
        <IconButton style={styles.iconButton}
                    iconStyle={styles.icon}
                    onClick={onHide}>
          <CloseIcon/>
        </IconButton>
      </h4>
    );
    return (
      <BaseDialog open={show}
                  onClose={onHide}
                  bodyStyle={styles.body}
                  titleStyle={styles.title}
                  primaryLabel={translate('buttons.close_button')}
                  onSubmit={onHide}
                  title={title}>
        <div style={styles.content}>
          <ChapterView contextIdReducer={contextIdReducer}
                       translate={translate}
                       scripturePane={scripturePane}
                       actions={actions}
                       selectionsReducer={selectionsReducer}
                       showModal={showModal}
                       projectDetailsReducer={projectDetailsReducer}
                       resourcesReducer={resourcesReducer}/>
        </div>
      </BaseDialog>
    );
  }
}

ChapterViewModal.propTypes = {
  translate: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  selectionsReducer: PropTypes.object.isRequired,
  contextIdReducer: PropTypes.object.isRequired,
  resourcesReducer: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
  scripturePane: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
  projectDetailsReducer: PropTypes.object.isRequired
};

export default ChapterViewModal;
