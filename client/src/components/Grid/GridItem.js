import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import Grid from "@material-ui/core/Grid";

export default function GridItem(props) {
  const { children, ...rest } = props;
  return (
    <Grid item {...rest} className={props.className}>
      {children}
    </Grid>
  );
}

GridItem.propTypes = {
  children: PropTypes.node
};
