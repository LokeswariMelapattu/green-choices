import React from "react";

const ActionButton = ({ text, onClick, className }) => {
  return (
    <button className={className} onClick={onClick} type="button">
      {text}
    </button>
  );
}

export default ActionButton;
