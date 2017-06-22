import React from 'react';
import {Col, Row} from 'react-bootstrap'
import AddBible from '../AddBible';

class BibleHeadingsRow extends React.Component {

  render() {
    let {currentPaneSettings} = this.props.modulesSettingsReducer.ScripturePane;
    let {bibles} = this.props.resourcesReducer;
    // if required data, then populate bibleHeadings
    let bibleHeadings = [];
    if (currentPaneSettings.length > 0) {
      bibleHeadings = currentPaneSettings.map((bibleId, index) => {
        let { language_name, resource_title, resource_id, direction } = bibles[bibleId]["manifest"];
        let resourceText = bibleId !== "targetLanguage" ? " (" + resource_title.toUpperCase() + ")" : "" ;
        let headingText = language_name + resourceText;
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
      display: 'flex', flex: '1 1 0%', justifyContent: 'center', alignItems: 'center',
      alignItems: 'stretch', padding: '10px', borderRight: '1px solid var(--border-color)',
      borderBottom: '3px solid var(--border-color)'
    };
    while (bibleHeadings.length < 3) {
      let remaining = 3 - bibleHeadings.length;
      bibleHeadings.push(
        <Col key={3-remaining} md={4} sm={4} xs={4} lg={4} style={colStyle} >
          <AddBible showModal={this.props.showModal} />
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
    )
  }
}

export default BibleHeadingsRow;
