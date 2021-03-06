import React from 'react';
import PropTypes from 'prop-types';
import {Col, Row} from 'react-bootstrap';
import AddBible from '../AddBible';
import {getTranslation} from "../../helpers/localizationHelpers";

class BibleHeadingsRow extends React.Component {

  render() {
    let {
      scripturePane: {
        currentPaneSettings
      }
    } = this.props;
    let {bibles} = this.props.resourcesReducer;
    const { translate } = this.props;
    // if required data, then populate bibleHeadings
    let bibleHeadings = [];
    if (currentPaneSettings.length > 0) {
      bibleHeadings = currentPaneSettings.map((paneSetting, index) => {
        const languageId = paneSetting.languageId;
        const bibleId = paneSetting.bibleId;
        let { language_name, direction } = bibles[languageId][bibleId]["manifest"];
        let resourceText = bibleId !== "targetBible" ? " (" + bibleId.toUpperCase() + ")" : "" ;
        let languageName = getTranslation(translate, language_name);
        let headingText = languageName + resourceText;
        let dir = direction;
        if (!dir) dir = this.props.projectDetailsReducer.manifest.target_language.direction;
        let colStyle = {
          alignItems: 'stretch', padding: '10px', fontSize: '16px', fontWeight: 'bold',
          color: 'var(--text-color-dark)', borderRight: '1px solid var(--border-color)',
          borderBottom: '3px solid var(--border-color)', direction: dir
        };

        return (
          <Col key={index} md={4} sm={4} xs={4} lg={4} style={colStyle} >
            <span>{headingText}</span>
          </Col>
        );
      });
    }

    let colStyle = {
      display: 'flex',
      flex: '1 1 0%',
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: '10px',
      borderRight: '1px solid var(--border-color)',
      borderBottom: '3px solid var(--border-color)'
    };
    while (bibleHeadings.length < 3) {
      let remaining = 3 - bibleHeadings.length;
      bibleHeadings.push(
        <Col key={3-remaining} md={4} sm={4} xs={4} lg={4} style={colStyle} >
          <AddBible showModal={this.props.showModal} translate={translate} />
        </Col>
      );
    }

    let rowStyle = {
      display: 'flex', height: "70px", margin: '0', marginRight: '12px',
      backgroundColor: 'var(--reverse-color)'
    };

    return (
      <Row style={rowStyle}>
        {bibleHeadings}
      </Row>
    );
  }
}

BibleHeadingsRow.propTypes = {
  scripturePane: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  projectDetailsReducer: PropTypes.shape({
    manifest: PropTypes.shape({
      target_language: PropTypes.shape({
        direction: PropTypes.string
      })
    })
  }),
  resourcesReducer: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired
};

export default BibleHeadingsRow;
