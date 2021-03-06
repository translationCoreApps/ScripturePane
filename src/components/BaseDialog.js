import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';

/**
 * Generates the dialog actions
 *
 * This was copied from tC core.
 * here should be a better way to provide a consistent dialog experience across tools.
 *
 * @param {bool} actionsEnabled enables/disables the action buttons
 * @param {*} primaryLabel the title of the primary button
 * @param {*} secondaryLabel the title of the secondary button
 * @param {func} onPrimaryClick the click callback of the primary button
 * @param {func} onSecondaryClick the click callback of the secondary button
 * @return {*}
 */
const makeDialogActions = ({actionsEnabled, primaryLabel, secondaryLabel, onPrimaryClick, onSecondaryClick}) => {
  const hasPrimaryLabel = Boolean(primaryLabel);
  const hasSecondaryLabel = Boolean(secondaryLabel);
  const hasPrimaryCallback = Boolean(onPrimaryClick);
  const hasSecondaryCallback = Boolean(onSecondaryClick);
  const actions = [];

  const primaryButton = (
    <button className="btn-prime"
            disabled={!actionsEnabled}
            onClick={onPrimaryClick}>
      {primaryLabel}
    </button>
  );
  const secondaryButton = (
    <button className="btn-second"
            disabled={!actionsEnabled}
            onClick={onSecondaryClick}>
      {secondaryLabel}
    </button>
  );

  if(hasSecondaryLabel && hasSecondaryCallback) {
    actions.push(secondaryButton);
  }

  if(hasPrimaryLabel && hasPrimaryCallback) {
    actions.push(primaryButton);
  }
  return actions;
};

/**
 * Represents a generic dialog.
 * You could use this to display simple information,
 * or you could create a new component that wraps this component
 * with some custom functionality.
 *
 * @class
 *
 * @property {object} [titleStyles] - styles applied to the dialog title
 * @property {object} [bodyStyles] - styles applied to the dialog body
 * @property {bool} [modal] - controls whether this dialog is modal
 * @property {Object[]} [actions] - a custom list of actions. This overrides the default secondary and primary actions.
 * @property {*} [title] - the title of the dialog
 * @property {*} [secondaryLabel] - the label of the secondary action
 * @property {*} [primaryLabel] - the label of the primary action
 * @property {bool} [actionsEnabled] - controls whether the actions are enabled or disabled
 * @property {bool} [open] - controls whether the dialog is open
 * @property {func} [onClose] - callback when the secondary button is triggered. Overridden by `actions`
 * @property {func} [onSubmit] - callback when the primary button is triggered. Overridden by `actions`
 */
class BaseDialog extends React.Component {

  componentDidCatch(error, info) {
    console.error(error);
    console.warn(info);
  }

  render () {
    const {
      actionsEnabled,
      modal,
      title,
      secondaryLabel,
      primaryLabel,
      onClose,
      onSubmit,
      open,
      bodyStyle,
      titleStyle,
      children,
      actions
    } = this.props;

    let dialogActions = actions ? actions : makeDialogActions({
      actionsEnabled,
      primaryLabel,
      secondaryLabel,
      onPrimaryClick: onSubmit,
      onSecondaryClick: onClose
    });

    let isModal = dialogActions.length !== 0;
    if(typeof modal !== 'undefined') {
      isModal = modal;
    }

    return (
      <MuiThemeProvider>
        <Dialog open={open}
                modal={isModal}
                title={title}
                titleStyle={{
                  color: 'var(--reverse-color)',
                  backgroundColor: 'var(--accent-color-dark)',
                  padding: '15px',
                  display: 'block',
                  width: '100%',
                  ...titleStyle
                }}
                bodyStyle={bodyStyle}
                onRequestClose={onClose}
                actions={dialogActions}>
          {children}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

BaseDialog.propTypes = {
  titleStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  modal: PropTypes.bool,
  actions: PropTypes.array,
  title: PropTypes.any,
  secondaryLabel: PropTypes.any,
  primaryLabel: PropTypes.any,
  actionsEnabled: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.any
};
BaseDialog.defaultProps = {
  actionsEnabled: true,
  modal: false
};

export default BaseDialog;
