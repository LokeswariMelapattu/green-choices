import React from "react";

const ActionButton = ({ text, onClick, className, tooltip }) => {
  return (
    <button className={className} onClick={onClick} type="button" data-tooltip-id={tooltip}>
      {text}
    </button>
  );
}

export default ActionButton;
