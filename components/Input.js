import React from "react";

const Input = ({
  name,
  label = name,
  type = "text",
  value = "",
  className = "",
  onChange,
  result,
  ...props
}) => {
  const failureMessages = [
    ...result.getErrors(name),
    ...result.getWarnings(name),
  ];

  return (
    <label className={className}>
      <div className="row">
        <strong className="col-xs-4">{label}:</strong>
        {!!failureMessages.length && (
          <span className="col-xs-8 error-container">{failureMessages[0]}</span>
        )}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    </label>
  );
};

export default Input;
