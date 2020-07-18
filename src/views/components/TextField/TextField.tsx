import React from "react";
import "./TextField.css";

type TextFieldProps = {
  focused?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: any;
  value?: any;
  type?: string;
  onKeyUp?: any

};

class TextField extends React.Component<TextFieldProps> {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  render() {
    return (
      <input
        value={this.props.value}
        onKeyUp={this.props.onKeyUp}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        type={this.props.type || "text"}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        className={`custom-text-input ${
          this.state.searchBarIsFocused ? "active" : null
          } ${this.props.className}`}
      />
    );
  }
}

export default TextField;
