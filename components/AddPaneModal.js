/**
 * @description This component displays a modal when the user clicks the add
 * resources button on the scripture pane module.
 */
import React from 'react';
import {Modal, Button, FormControl} from 'react-bootstrap';


export default class AddPaneModal extends React.Component {
  render() {
    let { staticPaneSettings, selectSourceLanguage, addPane, show, onHide, selectedPane } = this.props;
    /**
     * @description The code below generates a list of resource names and saves
     * it in option elements for the user to select from a dropdown list.
     */
    let panes = [];
    for (let key in staticPaneSettings) {
      panes.push(
        <option key={key} value={staticPaneSettings[key].sourceName.toString()}>
          {staticPaneSettings[key].heading.heading}
        </option>
      );
    }

    return (
      <Modal show={show} onHide={onHide} bsSize="lg" aria-labelledby="contained-modal-title-sm">
        <Modal.Header style={{ backgroundColor: "#333333" }} closeButton>
          <Modal.Title id="contained-modal-title-sm"
            style={{ textAlign: "center", color: "#FFFFFF" }}>
            Add Resources
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#333333", color: "#FFFFFF", padding: "45px 80px" }}>
          <h4 style={{ textAlign: "center", marginBottom: "45px" }}>
            Select the settings for the scripture source you want
                to load in to the scripture pane
            </h4>
          <label>Select source language name</label>
          <FormControl componentClass="select" style={{ width: "20%" }}
            onChange={e => { selectSourceLanguage(e) }}>
            <option value="">Select</option>
            {panes}
          </FormControl>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#333333" }}>
          <Button bsStyle="success" disabled={ !selectedPane } onClick={() => addPane()}>Load</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
